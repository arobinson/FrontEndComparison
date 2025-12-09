<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button from '../Button/Button.svelte';

  // Props with snippets for customization
  let {
    columns,
    value,
    totalPages,
    page = $bindable(0),
    pageSize = $bindable(50),
    pageSizes = [10, 25, 50],
    showFilterRow = false,
    emptyText = 'No data available',
    trackBy,
    header,
    filter,
    cell,
  }: {
    columns: string[];
    value: Record<string, any>[];
    totalPages: number;
    page?: number;
    pageSize?: number;
    pageSizes?: number[];
    showFilterRow?: boolean;
    emptyText?: string;
    trackBy?: string;
    header?: Snippet<[column: string]>;
    filter?: Snippet<[column: string]>;
    cell?: Snippet<[value: any, column: string, row: Record<string, any>]>;
  } = $props();

  // Computed values
  let hasData = $derived(value && value.length > 0);
  let isValidPageSize = $derived(pageSizes.includes(pageSize));

  // Get track value for a row
  function getRowTrackValue(row: Record<string, any>, index: number): any {
    if (trackBy && row[trackBy] !== undefined) {
      return row[trackBy];
    }
    return index;
  }

  // Navigation handlers
  function onPageChange(newPage: number) {
    if (newPage >= 0 && newPage < totalPages) {
      page = newPage;
    }
  }

  function onFirstPage() {
    onPageChange(0);
  }

  function onPreviousPage() {
    onPageChange(page - 1);
  }

  function onNextPage() {
    onPageChange(page + 1);
  }

  function onLastPage() {
    onPageChange(totalPages - 1);
  }

  function onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    pageSize = Number(target.value);
    page = 0;
  }
</script>

<div class="data-table-container">
  {#if hasData}
    <div class="table-wrapper">
      <table class="data-table">
        <thead class="table-header">
          <tr class="header-row">
            {#each columns as column (column)}
              <th class="header-cell" scope="col">
                {#if header}
                  {@render header(column)}
                {:else}
                  {column}
                {/if}
              </th>
            {/each}
          </tr>

          {#if showFilterRow}
            <tr class="filter-row">
              {#each columns as column (column)}
                <th class="filter-cell" scope="col">
                  {#if filter}
                    {@render filter(column)}
                  {/if}
                </th>
              {/each}
            </tr>
          {/if}
        </thead>

        <tbody class="table-body">
          {#each value as row, index (getRowTrackValue(row, index))}
            <tr class="data-row">
              {#each columns as column (column)}
                <td class="data-cell">
                  {#if cell}
                    {@render cell(row[column], column, row)}
                  {:else}
                    {row[column]}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="table-paginator">
      <div class="page-size-selector">
        <label for="pageSize">Items per page:</label>
        <select
          id="pageSize"
          value={pageSize}
          class:error={!isValidPageSize}
          onchange={onPageSizeChange}
        >
          {#each pageSizes as size (size)}
            <option value={size}>{size}</option>
          {/each}
        </select>
        {#if !isValidPageSize}
          <span class="error-message">Invalid page size: {pageSize}</span>
        {/if}
      </div>

      <div class="pagination-controls">
        <Button disabled={page === 0} onclick={onFirstPage} size="sm">
          First
        </Button>

        <Button disabled={page === 0} onclick={onPreviousPage} size="sm">
          Previous
        </Button>

        <span class="page-info">
          Page {page + 1} of {totalPages}
        </span>

        <Button disabled={page >= totalPages - 1} onclick={onNextPage} size="sm">
          Next
        </Button>

        <Button disabled={page >= totalPages - 1} onclick={onLastPage} size="sm">
          Last
        </Button>
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <p class="empty-text">{emptyText}</p>
    </div>
  {/if}
</div>

<style>
  .data-table-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .table-wrapper {
    flex: 1;
    overflow: auto;
    min-height: 0;
  }

  .data-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.875rem;
  }

  .header-cell,
  .filter-cell,
  .data-cell {
    padding: 0.375rem 0.5rem;
    text-align: left;
    vertical-align: middle;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .header-cell:first-child,
  .filter-cell:first-child,
  .data-cell:first-child {
    border-left: 1px solid #e0e0e0;
  }

  .header-row {
    background: #f5f5f5;
  }

  .header-cell {
    position: sticky;
    top: 0;
    z-index: 12;
    background: #f5f5f5;
    font-weight: 600;
    color: #333;
    min-width: 80px;
    border-top: 1px solid #e0e0e0;
    height: 2.5rem;
    box-sizing: border-box;
    overflow: hidden;
  }

  .filter-row {
    background: #fafafa;
  }

  .filter-cell {
    position: sticky;
    top: 2.5rem;
    z-index: 11;
    background: #fafafa;
    padding: 0.25rem 0.5rem;
    min-width: 80px;
    overflow: visible;
  }

  .data-cell {
    background: #fff;
    overflow: hidden;
  }

  .data-row:hover .data-cell {
    background: #f8f9fa;
  }

  .table-paginator {
    flex-shrink: 0;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-top: 1px solid #e0e0e0;
    z-index: 10;
    margin-top: auto;
  }

  .page-size-selector {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .page-size-selector label {
    font-size: 14px;
    color: #666;
  }

  .page-size-selector select {
    padding: 4px 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #fff;
  }

  .page-size-selector select.error {
    border-color: #dc3545;
    background-color: #fff5f5;
  }

  .error-message {
    color: #dc3545;
    font-size: 12px;
    margin-left: 8px;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .page-info {
    font-size: 14px;
    color: #666;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #666;
  }

  .empty-text {
    font-size: 16px;
    margin: 0;
  }
</style>
