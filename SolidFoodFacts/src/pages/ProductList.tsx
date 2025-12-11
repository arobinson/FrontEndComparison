import { createSignal, createEffect, createMemo, Show } from 'solid-js';
import type { MockProductViewModel } from 'shared-types';
import { allColumns, getColumnConfig, getColumnDataType } from 'shared-types';
import { productService } from '../services/productService';
import DataTable from '../components/shared/DataTable';
import CellRenderer from '../components/table/CellRenderer';
import { TextSearch, RangeSlider, MultiSelect } from '../components/filters';
import './ProductList.css';

export default function ProductList() {
  const [products, setProducts] = createSignal<MockProductViewModel[] | undefined>(undefined);
  const [productsState, setProductsState] = createSignal<'initial' | 'loading' | 'error' | 'loaded'>('initial');
  const [currentPage, setCurrentPage] = createSignal(0);
  const [pageSize, setPageSize] = createSignal(50);
  const [totalProducts, setTotalProducts] = createSignal(0);
  const [error, setError] = createSignal<Error | null>(null);
  const [filterResetTrigger, setFilterResetTrigger] = createSignal(0);
  const [filters, setFilters] = createSignal<Record<string, any>>({});

  // Column keys for the table
  const columnKeys = allColumns.map(col => col.key);

  // Computed values
  const totalPages = createMemo(() => Math.ceil(totalProducts() / pageSize()));

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
      setProductsState('loading');
      const result = await productService.getProductsByCategory('all', currentPage() + 1, pageSize());
      setProducts(result.products);
      setTotalProducts(result.total);
      setProductsState('loaded');
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
      setProductsState('error');
    }
  }

  // Track page/pageSize for refetching
  let lastPage = -1;
  let lastPageSize = -1;

  createEffect(() => {
    const page = currentPage();
    const size = pageSize();
    const pageChanged = page !== lastPage;
    const pageSizeChanged = size !== lastPageSize;

    if (pageChanged || pageSizeChanged) {
      lastPage = page;
      lastPageSize = size;
      loadProducts();
    }
  });

  function updateFilter(column: string, value: any) {
    setFilters({ ...filters(), [column]: value });
  }

  function resetFilters() {
    setFilters({});
    setFilterResetTrigger(filterResetTrigger() + 1);
  }

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  function handlePageSizeChange(newSize: number) {
    setPageSize(newSize);
    setCurrentPage(0);
  }

  function renderHeader(column: string) {
    return <strong>{getColumnTitle(column)}</strong>;
  }

  function renderFilter(column: string) {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);

    if (dataType === 'progress-bar') {
      return (
        <RangeSlider
          min={0}
          max={100}
          resetTrigger={filterResetTrigger()}
          onValueChange={(v) => updateFilter(column, v)}
        />
      );
    }
    if (dataType === 'grade-badge') {
      return (
        <MultiSelect
          options={['A', 'B', 'C', 'D', 'E', 'F']}
          resetTrigger={filterResetTrigger()}
          onValueChange={(v) => updateFilter(column, v)}
        />
      );
    }
    if (dataType === 'nova-dots') {
      return (
        <MultiSelect
          options={['1', '2', '3', '4']}
          resetTrigger={filterResetTrigger()}
          onValueChange={(v) => updateFilter(column, v)}
        />
      );
    }
    if (dataType === 'boolean-yesno') {
      return (
        <MultiSelect
          options={['Yes', 'No']}
          resetTrigger={filterResetTrigger()}
          onValueChange={(v) => updateFilter(column, v)}
        />
      );
    }
    if (dataType === 'large-counter') {
      return (
        <RangeSlider
          resetTrigger={filterResetTrigger()}
          onValueChange={(v) => updateFilter(column, v)}
        />
      );
    }
    if (dataType !== 'product-image') {
      return (
        <TextSearch
          resetTrigger={filterResetTrigger()}
          onValueChange={(v) => updateFilter(column, v)}
        />
      );
    }
    return null;
  }

  function renderCell(value: any, column: string, row: Record<string, any>) {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);
    const unit = getColumnUnit(column);
    return <CellRenderer value={value} dataType={dataType} column={column} row={row} unit={unit} />;
  }

  return (
    <div class="product-list-container">
      <div class="page-header-row">
        <h1>Products</h1>
        <button class="reset-button" onClick={resetFilters} type="button">
          Reset Filters
        </button>
      </div>

      <Show when={productsState() === 'loading'}>
        <div class="loading-indicator">⏳ Loading...</div>
      </Show>

      <Show when={productsState() === 'loaded' && products()?.length}>
        <DataTable
          columns={columnKeys}
          value={products()!}
          totalPages={totalPages()}
          page={currentPage()}
          pageSize={pageSize()}
          showFilterRow={true}
          trackBy="code"
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          renderHeader={renderHeader}
          renderFilter={renderFilter}
          renderCell={renderCell}
        />
      </Show>

      <Show when={productsState() === 'error'}>
        <p class="error-message">Error loading products: {error()?.message ?? 'Unknown'}</p>
      </Show>

      <Show when={productsState() === 'loaded' && !products()?.length}>
        <p>No products found.</p>
      </Show>
    </div>
  );
}
