import { useState, useMemo, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { allColumns } from '../config/columnConfig';
import { CellRenderer } from '../components/table/CellRenderer';
import './ProductList.css';
import type { MockProductViewModel } from 'shared-types';

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<Partial<Record<keyof MockProductViewModel, string>>>({});

  const { products, total, loading, error } = useProducts({
    category: 'all',
    page,
    pageSize
  });

  const filteredProducts = useMemo(() => {
    let result = products;

    (Object.entries(filters) as [keyof MockProductViewModel, string][]).forEach(([key, filterValue]) => {
      if (filterValue) {
        result = result.filter((product) => {
          const value = product[key];
          const valueStr = String(value ?? '').toLowerCase();
          const filterStr = filterValue.toLowerCase();
          return valueStr.includes(filterStr);
        });
      }
    });

    return result;
  }, [products, filters]);

  const handleFilterChange = useCallback((columnKey: keyof MockProductViewModel, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (value) {
        updated[columnKey] = value;
      } else {
        delete updated[columnKey];
      }
      return updated;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  let content;
  if (loading) {
    content = <div className="loading">Loading products...</div>;
  } else if (error) {
    content = <div className="error">Error: {error}</div>;
  } else {
    content = (
      <>
        <div className="table-header">
          <h1>Products</h1>
          <div className="table-info">
            <button onClick={handleResetFilters} className="reset-filters-btn">
              Reset Filters
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                {allColumns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
              <tr className="filter-row">
                {allColumns.map((column) => {
                  let filterCell;
                  if (!column.filterable) {
                    filterCell = <td key={column.key}></td>;
                  } else {
                    filterCell = (
                      <td key={column.key}>
                        <input
                          type="text"
                          className="filter-input"
                          value={filters[column.key] ?? ''}
                          onChange={(e) => {
                            handleFilterChange(column.key, e.target.value);
                          }}
                          onBlur={(e) => {
                            handleFilterChange(column.key, e.target.value);
                          }}
                          placeholder={`Filter ${column.label}...`}
                        />
                      </td>
                    );
                  }
                  return filterCell;
                })}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.code}>
                  {allColumns.map((column) => (
                    <td key={column.key}>
                      <CellRenderer column={column} row={product} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <div className="pagination-controls">
            <button
              onClick={() => {
                handlePageChange(page - 1);
              }}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => {
                handlePageChange(page + 1);
              }}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
          <div className="page-size-selector">
            <label>
              Items per page:
              <select
                value={pageSize}
                onChange={(e) => {
                  handlePageSizeChange(Number(e.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </div>
      </>
    );
  }

  return <div className="product-list-page">{content}</div>;
};

export default ProductList;
