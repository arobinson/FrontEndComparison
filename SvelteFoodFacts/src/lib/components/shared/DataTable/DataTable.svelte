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
    width: 100%;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .header-cell,
  .filter-cell,
  .data-cell {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .header-cell {
    font-weight: 600;
    background-color: #f9fafb;
  }

  .filter-cell {
    background-color: #f3f4f6;
  }

  .data-row:hover {
    background-color: #f9fafb;
  }

  .table-paginator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .page-size-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .page-size-selector select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
  }

  .page-size-selector select.error {
    border-color: #ef4444;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.75rem;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .page-info {
    padding: 0 0.5rem;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
  }

  .empty-text {
    color: #6b7280;
  }
</style>
