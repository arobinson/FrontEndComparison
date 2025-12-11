import { createMemo, For, Show } from 'solid-js';
import type { JSX } from 'solid-js';
import Button from './Button';
import './DataTable.css';

interface DataTableProps {
  columns: string[];
  value: Record<string, any>[];
  totalPages: number;
  page: number;
  pageSize: number;
  pageSizes?: number[];
  showFilterRow?: boolean;
  emptyText?: string;
  trackBy?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  renderHeader?: (column: string) => JSX.Element;
  renderFilter?: (column: string) => JSX.Element;
  renderCell?: (value: any, column: string, row: Record<string, any>) => JSX.Element;
}

export default function DataTable(props: DataTableProps) {
  const pageSizes = () => props.pageSizes ?? [10, 25, 50];
  const emptyText = () => props.emptyText ?? 'No data available';

  const hasData = createMemo(() => props.value && props.value.length > 0);
  const isValidPageSize = createMemo(() => pageSizes().includes(props.pageSize));

  function getRowTrackValue(row: Record<string, any>, index: number): any {
    if (props.trackBy && row[props.trackBy] !== undefined) {
      return row[props.trackBy];
    }
    return index;
  }

  function onFirstPage() {
    props.onPageChange(0);
  }

  function onPreviousPage() {
    if (props.page > 0) {
      props.onPageChange(props.page - 1);
    }
  }

  function onNextPage() {
    if (props.page < props.totalPages - 1) {
      props.onPageChange(props.page + 1);
    }
  }

  function onLastPage() {
    props.onPageChange(props.totalPages - 1);
  }

  function handlePageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    props.onPageSizeChange(Number(target.value));
  }

  return (
    <div class="data-table-container">
      <Show
        when={hasData()}
        fallback={
          <div class="empty-state">
            <p class="empty-text">{emptyText()}</p>
          </div>
        }
      >
        <div class="table-wrapper">
          <table class="data-table">
            <thead class="table-header">
              <tr class="header-row">
                <For each={props.columns}>
                  {(column) => (
                    <th class="header-cell" scope="col">
                      {props.renderHeader ? props.renderHeader(column) : column}
                    </th>
                  )}
                </For>
              </tr>

              <Show when={props.showFilterRow}>
                <tr class="filter-row">
                  <For each={props.columns}>
                    {(column) => (
                      <th class="filter-cell" scope="col">
                        {props.renderFilter?.(column)}
                      </th>
                    )}
                  </For>
                </tr>
              </Show>
            </thead>

            <tbody class="table-body">
              <For each={props.value}>
                {(row, index) => (
                  <tr class="data-row" data-key={getRowTrackValue(row, index())}>
                    <For each={props.columns}>
                      {(column) => (
                        <td class="data-cell">
                          {props.renderCell
                            ? props.renderCell(row[column], column, row)
                            : row[column]}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        <div class="table-paginator">
          <div class="page-size-selector">
            <label for="pageSize">Items per page:</label>
            <select
              id="pageSize"
              value={props.pageSize}
              class={!isValidPageSize() ? 'error' : ''}
              onChange={handlePageSizeChange}
            >
              <For each={pageSizes()}>
                {(size) => <option value={size}>{size}</option>}
              </For>
            </select>
            <Show when={!isValidPageSize()}>
              <span class="error-message">Invalid page size: {props.pageSize}</span>
            </Show>
          </div>

          <div class="pagination-controls">
            <Button disabled={props.page === 0} onClick={onFirstPage} size="sm">
              First
            </Button>

            <Button disabled={props.page === 0} onClick={onPreviousPage} size="sm">
              Previous
            </Button>

            <span class="page-info">
              Page {props.page + 1} of {props.totalPages}
            </span>

            <Button disabled={props.page >= props.totalPages - 1} onClick={onNextPage} size="sm">
              Next
            </Button>

            <Button disabled={props.page >= props.totalPages - 1} onClick={onLastPage} size="sm">
              Last
            </Button>
          </div>
        </div>
      </Show>
    </div>
  );
}
