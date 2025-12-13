<script lang="ts">
  import type { MockProductViewModel } from 'shared-types';
  import { allColumns, getColumnConfig, getColumnDataType } from 'shared-types';
  import { productService } from '$lib/services/productService';
  import { onMount } from 'svelte';
  import DataTable from '$lib/components/shared/DataTable/DataTable.svelte';
  import CellRenderer from '$lib/components/table/CellRenderer.svelte';
  import { TextSearch, RangeSlider, MultiSelect } from '$lib/components/filters';

  let products = $state<Array<MockProductViewModel> | undefined>(undefined);
  let productsState = $state<'initial' | 'loading' | 'error' | 'loaded'>('initial');
  let currentPage = $state(0);
  let pageSize = $state(50);
  let totalProducts = $state<number>(0);
  let error = $state<Error | null>(null);
  let filterResetTrigger = $state(0);
  let filters = $state<Record<string, any>>({});

  // Keep previous data during loading to prevent table destruction
  let previousProducts = $state<Array<MockProductViewModel> | undefined>(undefined);
  let previousTotalProducts = $state<number>(0);

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

  // Computed values for display (use previous data during loading, then apply filters)
  let baseProducts = $derived(products ?? previousProducts);
  // Inline filter logic so Svelte tracks all dependencies
  let displayProducts = $derived.by(() => {
    const prods = baseProducts;
    if (!prods) return [];

    const activeFilters = filters;
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
  let displayTotal = $derived(totalProducts > 0 ? totalProducts : previousTotalProducts);

  // Data fetching
  async function loadProducts() {
    try {
      productsState = 'loading';
      const result = await productService.getProductsByCategory('all', currentPage + 1, pageSize);
      products = result.products;
      totalProducts = result.total;
      // Store as previous for next loading state
      previousProducts = result.products;
      previousTotalProducts = result.total;
      productsState = 'loaded';
    } catch (e) {
      error = e instanceof Error ? e : new Error('An unknown error occurred');
      productsState = 'error';
    }
  }

  // Track page/pageSize for refetching
  let lastPage = $state(-1);
  let lastPageSize = $state(-1);

  $effect(() => {
    const pageChanged = currentPage !== lastPage;
    const pageSizeChanged = pageSize !== lastPageSize;

    if (pageChanged || pageSizeChanged) {
      lastPage = currentPage;
      lastPageSize = pageSize;
      loadProducts();
    }
  });

  function updateFilter(column: string, value: any) {
    filters = { ...filters, [column]: value };
  }

  function resetFilters() {
    filters = {};
    filterResetTrigger++;
  }
</script>

<div class="product-list-container">
  <div class="page-header-row">
    <h1>Products</h1>
    <button class="reset-button" onclick={resetFilters} type="button">
      Reset Filters
    </button>
  </div>

  <div class="table-area">
    {#if productsState === 'loading'}
      <div class="loading-overlay">
        <span class="loading-indicator">⏳ Loading...</span>
      </div>
    {/if}

    {#if displayProducts?.length}
      <DataTable
        columns={columnKeys}
        value={displayProducts}
        {totalPages}
        bind:page={currentPage}
        bind:pageSize={pageSize}
        showFilterRow={true}
        trackBy="code"
      >
        {#snippet header(column)}
          <strong>{getColumnTitle(column)}</strong>
        {/snippet}

        {#snippet filter(column)}
          {@const dataType = getColumnDataType(column as keyof MockProductViewModel)}
          {#if dataType === 'progress-bar'}
            <RangeSlider
              min={0}
              max={100}
              resetTrigger={filterResetTrigger}
              onValueChange={(v) => updateFilter(column, v)}
            />
          {:else if dataType === 'grade-badge'}
            <MultiSelect
              options={['A', 'B', 'C', 'D', 'E', 'F']}
              resetTrigger={filterResetTrigger}
              onValueChange={(v) => updateFilter(column, v)}
            />
          {:else if dataType === 'nova-dots'}
            <MultiSelect
              options={['1', '2', '3', '4']}
              resetTrigger={filterResetTrigger}
              onValueChange={(v) => updateFilter(column, v)}
            />
          {:else if dataType === 'boolean-yesno'}
            <MultiSelect
              options={['Yes', 'No']}
              resetTrigger={filterResetTrigger}
              onValueChange={(v) => updateFilter(column, v)}
            />
          {:else if dataType === 'large-counter'}
            <RangeSlider
              resetTrigger={filterResetTrigger}
              onValueChange={(v) => updateFilter(column, v)}
            />
          {:else if dataType !== 'product-image'}
            <TextSearch
              resetTrigger={filterResetTrigger}
              onValueChange={(v) => updateFilter(column, v)}
            />
          {/if}
        {/snippet}

        {#snippet cell(value, column, row)}
          {@const dataType = getColumnDataType(column as keyof MockProductViewModel)}
          {@const unit = getColumnUnit(column)}
          <CellRenderer {value} {dataType} {column} {row} {unit} />
        {/snippet}
      </DataTable>
    {:else if productsState === 'error'}
      <p class="error-message">Error loading products: {error?.message ?? 'Unknown'}</p>
    {:else if productsState !== 'loading'}
      <p>No products found.</p>
    {/if}
  </div>
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

  .page-header-row h1 {
    color: #333;
    margin: 0;
  }

  .reset-button {
    padding: 8px 16px;
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .reset-button:hover {
    background-color: #004499;
  }

  .reset-button:active {
    transform: translateY(1px);
  }

  .loading-indicator {
    padding: 0.75rem 1.5rem;
    background-color: #f0f8ff;
    border-left: 4px solid #0066cc;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .error-message {
    color: #dc3545;
    padding: 1rem;
  }
</style>
