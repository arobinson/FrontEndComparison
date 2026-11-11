import type { ReactNode } from 'react';
import { Button } from '../Button';
import './DataTable.css';

interface DataTableProps<T extends Record<string, any>> {
  columns: string[];
  value: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  pageSizes?: number[];
  showFilterRow?: boolean;
  emptyText?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  renderHeader?: (column: string) => ReactNode;
  renderFilterCell?: (column: string) => ReactNode;
  renderCell?: (value: any, column: string, row: T) => ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  value,
  totalPages,
  page,
  pageSize,
  pageSizes = [10, 25, 50],
  showFilterRow = false,
  emptyText = 'No data available',
  onPageChange,
  onPageSizeChange,
  renderHeader,
  renderFilterCell,
  renderCell,
}: DataTableProps<T>) {
  const hasData = value && value.length > 0;

  const isValidPageSize = pageSizes.includes(pageSize);

  const handlePageChange = (newPage: number) => {
      if (newPage >= 0 && newPage < totalPages) {
        onPageChange(newPage);
      }
    };

  const handleFirstPage = () => handlePageChange(0);
  const handlePreviousPage = () => handlePageChange(page - 1);
  const handleNextPage = () => handlePageChange(page + 1);
  const handleLastPage = () => handlePageChange(totalPages - 1);

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange(Number(event.target.value));
    };

  if (!hasData) {
    return (
      <div className="data-table-container">
        <div className="empty-state">
          <p className="empty-text">{emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead className="table-header">
            <tr className="header-row">
              {columns.map((column) => (
                <th key={column} className="header-cell" scope="col">
                  {renderHeader ? renderHeader(column) : column}
                </th>
              ))}
            </tr>

            {showFilterRow && (
              <tr className="filter-row">
                {columns.map((column) => (
                  <th key={column} className="filter-cell" scope="col">
                    {renderFilterCell ? renderFilterCell(column) : null}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody className="table-body">
            {/* Rows are reused by position, not keyed: a page change replaces every record, so updating the existing rows is cheaper than unmounting and remounting all of them. */}
            {value.map((row, index) => (
              <tr key={index} className="data-row">
                {columns.map((column) => (
                  <td key={column} className="data-cell">
                    {renderCell ? renderCell(row[column], column, row) : row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-paginator">
        <div className="page-size-selector">
          <label htmlFor="pageSize">Items per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            className={!isValidPageSize ? 'error' : ''}
            onChange={handlePageSizeChange}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {!isValidPageSize && (
            <span className="error-message">Invalid page size: {pageSize}</span>
          )}
        </div>

        <div className="pagination-controls">
          <Button disabled={page === 0} onClick={handleFirstPage} size="sm">
            First
          </Button>

          <Button disabled={page === 0} onClick={handlePreviousPage} size="sm">
            Previous
          </Button>

          <span className="page-info">
            Page {page + 1} of {totalPages}
          </span>

          <Button disabled={page >= totalPages - 1} onClick={handleNextPage} size="sm">
            Next
          </Button>

          <Button disabled={page >= totalPages - 1} onClick={handleLastPage} size="sm">
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
