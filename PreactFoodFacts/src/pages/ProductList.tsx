import { useState, useMemo, useCallback } from 'preact/hooks';
import { useProducts } from '../hooks/useProducts';
import { allColumns, getColumnConfig } from '../config/columnConfig';
import {
  Button,
  DataTable,
  TextSearch,
  RangeSlider,
  MultiSelect,
  type RangeValue,
} from '../components/shared';
import {
  useFiltersReducer,
  type FilterActions,
} from '../components/shared/filters/filterStore';
import { CellRenderer } from '../components/table/CellRenderer';
import './ProductList.css';
import type { MockProductViewModel } from 'shared-types';

// Static table config, hoisted so DataTable's memo is not defeated by fresh
// arrays on every render.
const columns = allColumns.map((col) => col.key);
const pageSizes = [10, 25, 50];
const GRADE_OPTIONS = ['A', 'B', 'C', 'D', 'F'];
const NOVA_OPTIONS = ['1', '2', '3', '4'];
const YES_NO_OPTIONS = ['Yes', 'No'];
// Draft fallbacks for untouched filters (empty inputs, no selection).
const NO_RANGE: RangeValue = {};
const NO_SELECTION: string[] = [];

const ProductList = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [filterState, dispatch] = useFiltersReducer();
  const filters = filterState.applied;
  const drafts = filterState.drafts;

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

  // Store actions. Committing (apply) or clearing filters also returns to the
  // first page.
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

  // Each control shows its column's draft; edits update the draft, and a commit
  // (blur/Enter, or every MultiSelect toggle) applies it.
  const renderFilterCell = useCallback((column: string) => {
    const dataType = getColumnDataType(column);
    const draft = drafts[column];
    const { setDraft, apply } = filterActions;
    const setColumnDraft = (value: string | RangeValue) => setDraft(column, value);
    const applyColumn = () => apply(column);
    const selectAndApply = (value: string[]) => {
      setDraft(column, value);
      apply(column);
    };

    switch (dataType) {
      case 'progress-bar':
        return (
          <RangeSlider
            value={(draft as RangeValue | undefined) ?? NO_RANGE}
            min={0}
            max={100}
            onValueChange={setColumnDraft}
            onCommit={applyColumn}
          />
        );
      case 'grade-badge':
        return (
          <MultiSelect
            options={GRADE_OPTIONS}
            value={(draft as string[] | undefined) ?? NO_SELECTION}
            onValueChange={selectAndApply}
          />
        );
      case 'nova-dots':
        return (
          <MultiSelect
            options={NOVA_OPTIONS}
            value={(draft as string[] | undefined) ?? NO_SELECTION}
            onValueChange={selectAndApply}
          />
        );
      case 'large-counter':
        return (
          <RangeSlider
            value={(draft as RangeValue | undefined) ?? NO_RANGE}
            onValueChange={setColumnDraft}
            onCommit={applyColumn}
          />
        );
      case 'boolean-yesno':
        return (
          <MultiSelect
            options={YES_NO_OPTIONS}
            value={(draft as string[] | undefined) ?? NO_SELECTION}
            onValueChange={selectAndApply}
          />
        );
      case 'product-image':
        return null;
      default:
        return (
          <TextSearch
            value={(draft as string | undefined) ?? ''}
            onValueChange={setColumnDraft}
            onCommit={applyColumn}
          />
        );
    }
  }, [drafts, filterActions]);

  const renderCell = useCallback((value: any, column: string, row: Record<string, any>) => {
    const columnConfig = getColumnConfig(column as keyof MockProductViewModel);
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
          showFilterRow
          trackBy="code"
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
    <div className="product-list-container">
      <div className="page-header-row">
        <h1>Products</h1>
        <Button className="reset-button" onClick={filterActions.clear}>
          Reset Filters
        </Button>
      </div>
      {content}
    </div>
  );
};

export default ProductList;
