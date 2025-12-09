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

  // Data fetching
  async function loadProducts() {
    try {
      productsState = 'loading';
      const result = await productService.getProductsByCategory('food', currentPage + 1, pageSize);
      products = result.products;
      totalProducts = result.total;
      productsState = 'loaded';
    } catch (e) {
      error = e instanceof Error ? e : new Error('An unknown error occurred');
      productsState = 'error';
    }
  }

  onMount(() => {
    loadProducts();
  });

  // Re-fetch when page or pageSize changes
  $effect(() => {
    if (productsState !== 'initial') {
      loadProducts();
    }
  });

  // Filter state
  let filters = $state<Record<string, any>>({});

  function updateFilter(column: string, value: any) {
    filters[column] = value;
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

  {#if productsState === 'loading'}
    <div class="loading-indicator">Loading...</div>
  {:else if productsState === 'loaded' && products?.length}
    <DataTable
      columns={columnKeys}
      value={products}
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
  {:else}
    <p>No products found.</p>
  {/if}
</div>

<style>
  .product-list-container {
    padding: 1rem;
    max-width: 100%;
    overflow-x: auto;
  }

  .page-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .page-header-row h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .reset-button {
    padding: 0.5rem 1rem;
    background-color: #6b7280;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
  }

  .reset-button:hover {
    background-color: #4b5563;
  }

  .loading-indicator {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  .error-message {
    color: #ef4444;
    padding: 1rem;
  }
</style>
