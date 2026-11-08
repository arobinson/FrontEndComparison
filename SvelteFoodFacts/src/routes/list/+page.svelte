<script lang="ts">
  import type { MockProductViewModel } from 'shared-types';
  import { allColumns, getColumnConfig, getColumnDataType } from 'shared-types';
  import { productService } from '#lib/services/productService';
  import { onMount } from 'svelte';
  import CellRenderer from '#lib/components/table/CellRenderer.svelte';
  import { Button, DataTable, TextSearch, RangeSlider, MultiSelect } from '#lib/components/controls';
  import { FilterStore, type RangeFilterValue } from '#lib/stores/filterStore.svelte';

  // Fetched data is only ever replaced, never mutated: no deep proxy needed.
  // The previous page stays in `products` while the next one loads (rows stay visible under the overlay).
  let products = $state.raw<Array<MockProductViewModel> | undefined>(undefined);
  let productsState = $state<'loading' | 'error' | 'loaded'>('loading');
  let currentPage = $state(0);
  let pageSize = $state(50);
  let totalProducts = $state<number>(0);
  let error = $state<string | null>(null);

  // Page-scoped filter state. The filter controls are generic and store-agnostic: the filter
  // snippet binds each control's value to the column's draft and applies on commit.
  // Applying or clearing a filter returns to the first page.
  const filterStore = new FilterStore(goToFirstPage);

  // Shared empty values for columns without a draft (controls never mutate their value).
  const EMPTY_RANGE: RangeFilterValue = {};
  const EMPTY_SELECTION: string[] = [];

  function textDraft(column: string): string {
    return (filterStore.drafts[column] as string | undefined) ?? '';
  }

  function rangeDraft(column: string): RangeFilterValue {
    return (filterStore.drafts[column] as RangeFilterValue | undefined) ?? EMPTY_RANGE;
  }

  function selectionDraft(column: string): string[] {
    return (filterStore.drafts[column] as string[] | undefined) ?? EMPTY_SELECTION;
  }

  // Multi-select applies on every toggle.
  function setSelection(column: string, value: string[]) {
    filterStore.setDraft(column, value);
    filterStore.apply(column);
  }

  // Column keys for the table
  const columnKeys = allColumns.map(col => col.key);

  // Computed values
  let totalPages = $derived(Math.ceil(totalProducts / pageSize));

  // Helper functions
  function getColumnTitle(key: string): string {
    return getColumnConfig(key as keyof MockProductViewModel)?.label ?? key;
  }

  function getColumnUnit(key: string): string | undefined {
    return getColumnConfig(key as keyof MockProductViewModel)?.unit;
  }

  // Rows shown: the fetched page with the applied filters.
  let displayProducts = $derived.by(() => {
    const prods = products;
    if (!prods) return [];

    const activeFilters = filterStore.applied;
    if (Object.keys(activeFilters).length === 0) {
      return prods;
    }

    return prods.filter((product) => {
      for (const [column, filterValue] of Object.entries(activeFilters)) {
        if (!filterValue) continue;

        const productValue = (product as Record<string, any>)[column];

        // Text search
        if (typeof filterValue === 'string') {
          if (filterValue.length > 0) {
            if (!productValue?.toString().toLowerCase().includes(filterValue.toLowerCase())) {
              return false;
            }
          }
        }
        // Range filter
        else if (typeof filterValue === 'object' && filterValue !== null && ('min' in filterValue || 'max' in filterValue)) {
          const rangeFilter = filterValue as { min?: number; max?: number };
          const numValue = Number(productValue);
          if (rangeFilter.min !== undefined && numValue < rangeFilter.min) {
            return false;
          }
          if (rangeFilter.max !== undefined && numValue > rangeFilter.max) {
            return false;
          }
        }
        // Multi-select
        else if (Array.isArray(filterValue)) {
          if (filterValue.length > 0) {
            // Handle boolean yes/no filters
            if (typeof productValue === 'boolean') {
              const boolStrings = filterValue.map((v: string) => {
                if (v === 'Yes') return true;
                if (v === 'No') return false;
                return v;
              });
              if (!boolStrings.includes(productValue)) {
                return false;
              }
            } else if (!filterValue.includes(productValue)) {
              return false;
            }
          }
        }
      }
      return true;
    });
  });

  // Data fetching
  async function loadProducts() {
    try {
      productsState = 'loading';
      const result = await productService.getProductsByCategory('all', currentPage + 1, pageSize);
      products = result.products;
      totalProducts = result.total;
      productsState = 'loaded';
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to fetch products';
      productsState = 'error';
    }
  }

  onMount(() => {
    loadProducts();
  });

  function handlePageChange(page: number) {
    currentPage = page;
    loadProducts();
  }

  function handlePageSizeChange(size: number) {
    pageSize = size;
    currentPage = 0;
    loadProducts();
  }

  function goToFirstPage() {
    if (currentPage !== 0) {
      handlePageChange(0);
    }
  }

  function resetFilters() {
    filterStore.clear();
  }
</script>

<div class="product-list-container">
  <div class="page-header-row">
    <h1>Products</h1>
    <Button class="reset-button" onclick={resetFilters}>
      Reset Filters
    </Button>
  </div>

  {#if productsState === 'error'}
    <p>Error loading products: {error}</p>
  {:else if products && products.length > 0}
    <div class="table-area">
      {#if productsState === 'loading'}
        <div class="loading-overlay">
          <div class="loading-indicator">Loading...</div>
        </div>
      {/if}
      <DataTable
        columns={columnKeys}
        value={displayProducts}
        {totalPages}
        page={currentPage}
        {pageSize}
        pageSizes={[10, 25, 50]}
        showFilterRow={true}
        trackBy="code"
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      >
        {#snippet header(column)}
          <strong>{getColumnTitle(column)}</strong>
        {/snippet}

        {#snippet filter(column)}
          {@const dataType = getColumnDataType(column as keyof MockProductViewModel)}
          {#if dataType === 'progress-bar'}
            <RangeSlider
              bind:value={() => rangeDraft(column), (v) => filterStore.setDraft(column, v)}
              oncommit={() => filterStore.apply(column)}
              min={0}
              max={100}
            />
          {:else if dataType === 'grade-badge'}
            <MultiSelect
              options={['A', 'B', 'C', 'D', 'F']}
              bind:value={() => selectionDraft(column), (v) => setSelection(column, v)}
            />
          {:else if dataType === 'nova-dots'}
            <MultiSelect
              options={['1', '2', '3', '4']}
              bind:value={() => selectionDraft(column), (v) => setSelection(column, v)}
            />
          {:else if dataType === 'boolean-yesno'}
            <MultiSelect
              options={['Yes', 'No']}
              bind:value={() => selectionDraft(column), (v) => setSelection(column, v)}
            />
          {:else if dataType === 'large-counter'}
            <RangeSlider
              bind:value={() => rangeDraft(column), (v) => filterStore.setDraft(column, v)}
              oncommit={() => filterStore.apply(column)}
            />
          {:else if dataType !== 'product-image'}
            <TextSearch
              bind:value={() => textDraft(column), (v) => filterStore.setDraft(column, v)}
              oncommit={() => filterStore.apply(column)}
            />
          {/if}
        {/snippet}

        {#snippet cell(value, column, row)}
          {@const dataType = getColumnDataType(column as keyof MockProductViewModel)}
          {@const unit = getColumnUnit(column)}
          <CellRenderer {value} {dataType} {column} {row} {unit} />
        {/snippet}
      </DataTable>
    </div>
  {:else if productsState === 'loading'}
    <div class="loading-indicator">Loading products...</div>
  {:else}
    <p>No products found.</p>
  {/if}
</div>

<style>
  .product-list-container {
    padding: 1.25rem;
    height: calc(100vh - 41px); /* Account for framework header */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
  }

  .table-area {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    border-radius: 8px;
  }

  .page-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    flex-shrink: 0;
  }

  .loading-indicator {
    padding: 0.5rem 1rem;
    background-color: #f0f8ff;
    border-left: 4px solid #0066cc;
    margin-bottom: 1rem;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
  }

  .product-list-container h1 {
    color: #333;
    margin: 0;
  }

  .page-header-row :global(.reset-button) {
    padding: 8px 16px;
    background-color: var(--color-primary, #0066cc);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .page-header-row :global(.reset-button:hover) {
    background-color: var(--color-primary-dark, #004499);
  }

  .page-header-row :global(.reset-button:active) {
    transform: translateY(1px);
  }

  .product-list-container :global(.data-table-container) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
</style>
