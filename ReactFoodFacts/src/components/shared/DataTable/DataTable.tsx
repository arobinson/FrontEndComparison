import { memo, useCallback, useMemo, type ReactNode } from 'react';
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

function DataTableInner<T extends Record<string, any>>({
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
  const hasData = useMemo(() => value && value.length > 0, [value]);

  const isValidPageSize = useMemo(
    () => pageSizes.includes(pageSize),
    [pageSizes, pageSize]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 0 && newPage < totalPages) {
        onPageChange(newPage);
      }
    },
    [totalPages, onPageChange]
  );

  const handleFirstPage = useCallback(() => handlePageChange(0), [handlePageChange]);
  const handlePreviousPage = useCallback(() => handlePageChange(page - 1), [handlePageChange, page]);
  const handleNextPage = useCallback(() => handlePageChange(page + 1), [handlePageChange, page]);
  const handleLastPage = useCallback(() => handlePageChange(totalPages - 1), [handlePageChange, totalPages]);

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange(Number(event.target.value));
    },
    [onPageSizeChange]
  );

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
            {value.map((row, rowIndex) => (
              <tr key={rowIndex} className="data-row">
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

export const DataTable = memo(DataTableInner) as typeof DataTableInner;
