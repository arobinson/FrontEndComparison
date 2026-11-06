import { useState, useMemo, useCallback } from 'preact/hooks';
import { useProducts } from '../hooks/useProducts';
import { allColumns, getColumnConfig } from '../config/columnConfig';
import { DataTable, TextSearch, RangeSlider, MultiSelect } from '../components/shared';
import {
  FiltersContext,
  FilterActionsContext,
  useFiltersReducer,
  type FilterActions,
} from '../components/shared/filters/filterStore';
import { CellRenderer } from '../components/table/CellRenderer';
import './ProductList.css';
import type { MockProductViewModel } from 'shared-types';

// Static table config, hoisted so DataTable's memo is not defeated by fresh
// arrays on every render (typing in a filter re-renders this page through the
// filter store; the table itself should not re-render for a draft change).
const columns = allColumns.map((col) => col.key);
const pageSizes = [10, 25, 50];

const ProductList = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [filterState, dispatch] = useFiltersReducer();
  const filters = filterState.applied;

  const { products, total, loading, error } = useProducts({
    category: 'all',
    page: page + 1,
    pageSize
  });

  const filteredProducts = useMemo(() => {
    let result = products;

    Object.entries(filters).forEach(([column, filterValue]) => {
      if (!filterValue) return;

      result = result.filter((product) => {
        const productValue = (product as Record<string, any>)[column];

        // Text search
        if (typeof filterValue === 'string') {
          return productValue
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
        // Range filter
        if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
          const numValue = Number(productValue);
          if (filterValue.min !== undefined && numValue < filterValue.min) {
            return false;
          }
          if (filterValue.max !== undefined && numValue > filterValue.max) {
            return false;
          }
          return true;
        }
        // Multi-select
        if (Array.isArray(filterValue)) {
          if (filterValue.length === 0) return true;
          // Handle boolean yes/no filters
          if (typeof productValue === 'boolean') {
            const boolStrings = filterValue.map((v) => {
              if (v === 'Yes') return true;
              if (v === 'No') return false;
              return v;
            });
            return boolStrings.includes(productValue);
          }
          return filterValue.includes(productValue);
        }
        return true;
      });
    });

    return result;
  }, [products, filters]);

  // Store actions handed to the filter components. Committing (apply) or
  // clearing filters also returns to the first page, as before.
  const filterActions = useMemo<FilterActions>(() => ({
    setDraft: (column, value) => dispatch({ type: 'setDraft', column, value }),
    apply: (column) => {
      dispatch({ type: 'apply', column });
      setPage(0);
    },
    clear: () => {
      dispatch({ type: 'clear' });
      setPage(0);
    },
  }), [dispatch]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  const getColumnDataType = (column: string): string => {
    return getColumnConfig(column as keyof MockProductViewModel)?.type ?? 'simple-text';
  };

  const getColumnTitle = (column: string): string => {
    return getColumnConfig(column as keyof MockProductViewModel)?.label ?? column;
  };

  const renderHeader = useCallback((column: string) => {
    return <strong>{getColumnTitle(column)}</strong>;
  }, []);

  const renderFilterCell = useCallback((column: string) => {
    const dataType = getColumnDataType(column);

    switch (dataType) {
      case 'progress-bar':
        return (
          <RangeSlider
            column={column}
            min={0}
            max={100}
          />
        );
      case 'grade-badge':
        return (
          <MultiSelect
            column={column}
            options={['A', 'B', 'C', 'D', 'F']}
          />
        );
      case 'nova-dots':
        return (
          <MultiSelect
            column={column}
            options={['1', '2', '3', '4']}
          />
        );
      case 'large-counter':
        return (
          <RangeSlider
            column={column}
          />
        );
      case 'boolean-yesno':
        return (
          <MultiSelect
            column={column}
            options={['Yes', 'No']}
          />
        );
      case 'product-image':
        return null;
      default:
        return (
          <TextSearch column={column} />
        );
    }
  }, []);

  const renderCell = useCallback((value: any, column: string, row: Record<string, any>) => {
    const columnConfig = allColumns.find((col) => col.key === column);
    if (!columnConfig) return value ?? '';
    return <CellRenderer column={columnConfig} row={row} />;
  }, []);

  let content;
  if (error) {
    content = <p>Error loading products: {error}</p>;
  } else if (products.length > 0) {
    content = (
      <div className="table-area">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-indicator">Loading...</div>
          </div>
        )}
        <DataTable
          columns={columns}
          value={filteredProducts}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          pageSizes={pageSizes}
          showFilterRow={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          renderHeader={renderHeader}
          renderFilterCell={renderFilterCell}
          renderCell={renderCell}
        />
      </div>
    );
  } else if (loading) {
    content = <div className="loading-indicator">Loading products...</div>;
  } else {
    content = <p>No products found.</p>;
  }

  return (
    <FilterActionsContext.Provider value={filterActions}>
      <FiltersContext.Provider value={filterState}>
        <div className="product-list-container">
          <div className="page-header-row">
            <h1>Products</h1>
            <button className="reset-button" onClick={filterActions.clear} type="button">
              Reset Filters
            </button>
          </div>
          {content}
        </div>
      </FiltersContext.Provider>
    </FilterActionsContext.Provider>
  );
};

export default ProductList;
