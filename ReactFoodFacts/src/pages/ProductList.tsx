import { useState, useMemo, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { allColumns, getColumnConfig } from '../config/columnConfig';
import { DataTable, TextSearch, RangeSlider, MultiSelect } from '../components/shared';
import { CellRenderer } from '../components/table/CellRenderer';
import './ProductList.css';
import type { MockProductViewModel } from 'shared-types';

type FilterValue = string | { min?: number; max?: number } | string[];

const ProductList = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [filterResetTrigger, setFilterResetTrigger] = useState(0);

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

  const updateFilter = useCallback((column: string, value: FilterValue) => {
    setFilters((current) => ({
      ...current,
      [column]: value,
    }));
    setPage(0);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(0);
    setFilterResetTrigger((val) => val + 1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  }, []);

  const totalPages = Math.ceil(total / pageSize);
  const columns = allColumns.map((col) => col.key);

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
            min={0}
            max={100}
            resetTrigger={filterResetTrigger}
            onValueChange={(value) => updateFilter(column, value)}
          />
        );
      case 'grade-badge':
        return (
          <MultiSelect
            options={['A', 'B', 'C', 'D', 'F']}
            resetTrigger={filterResetTrigger}
            onValueChange={(value) => updateFilter(column, value)}
          />
        );
      case 'nova-dots':
        return (
          <MultiSelect
            options={['1', '2', '3', '4']}
            resetTrigger={filterResetTrigger}
            onValueChange={(value) => updateFilter(column, value)}
          />
        );
      case 'large-counter':
        return (
          <RangeSlider
            resetTrigger={filterResetTrigger}
            onValueChange={(value) => updateFilter(column, value)}
          />
        );
      case 'boolean-yesno':
        return (
          <MultiSelect
            options={['Yes', 'No']}
            resetTrigger={filterResetTrigger}
            onValueChange={(value) => updateFilter(column, value)}
          />
        );
      case 'product-image':
        return null;
      default:
        return (
          <TextSearch
            resetTrigger={filterResetTrigger}
            onValueChange={(value) => updateFilter(column, value)}
          />
        );
    }
  }, [filterResetTrigger, updateFilter]);

  const renderCell = useCallback((value: any, column: string, row: Record<string, any>) => {
    const columnConfig = allColumns.find((col) => col.key === column);
    if (!columnConfig) return value ?? '';
    return <CellRenderer column={columnConfig} row={row} />;
  }, []);

  let content;
  if (loading && products.length === 0) {
    content = <p>Loading products...</p>;
  } else if (error) {
    content = <p>Error loading products: {error}</p>;
  } else if (products.length > 0) {
    content = (
      <>
        {loading && (
          <div className="loading-indicator">⏳ Loading...</div>
        )}
        <DataTable
          columns={columns}
          value={filteredProducts}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          pageSizes={[10, 25, 50]}
          showFilterRow={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          renderHeader={renderHeader}
          renderFilterCell={renderFilterCell}
          renderCell={renderCell}
        />
      </>
    );
  } else {
    content = <p>No products found.</p>;
  }

  return (
    <div className="product-list-container">
      <div className="page-header-row">
        <h1>Products</h1>
        <button className="reset-button" onClick={resetFilters} type="button">
          Reset Filters
        </button>
      </div>
      {content}
    </div>
  );
};

export default ProductList;
