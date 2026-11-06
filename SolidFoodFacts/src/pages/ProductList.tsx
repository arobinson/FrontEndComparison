import { createSignal, createMemo, useTransition, Match, Show, Suspense, Switch } from 'solid-js';
import { createAsync } from '@solidjs/router';
import type { MockProductViewModel } from 'shared-types';
import { allColumns, getColumnConfig, getColumnDataType } from 'shared-types';
import { productService, type ProductsResponse } from '../services/productService';
import DataTable from '../components/shared/DataTable';
import CellRenderer from '../components/table/CellRenderer';
import { TextSearch, RangeSlider, MultiSelect } from '../components/controls';
import { createFilterStore } from '../components/filters/filterStore';
import type { FilterValue, RangeFilter } from '../components/filters/filterStore';
import Button from '../components/shared/Button';
import './ProductList.css';

type ProductsPage = ProductsResponse & { error?: string };

// Client-side filtering of the current page by the applied filters
function applyFilters(products: MockProductViewModel[], filters: Record<string, FilterValue | undefined>): MockProductViewModel[] {
  let result = products;

  Object.entries(filters).forEach(([column, filterValue]) => {
    if (!filterValue) return;

    result = result.filter((product) => {
      const productValue = (product as Record<string, any>)[column];

      // Text search
      if (typeof filterValue === 'string') {
        return productValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      // Range filter
      if (typeof filterValue === 'object' && !Array.isArray(filterValue)) {
        const numValue = Number(productValue);
        if (filterValue.min !== undefined && numValue < filterValue.min) {
          return false;
        }
        if (filterValue.max !== undefined && numValue > filterValue.max) {
          return false;
        }
        return true;
      }
      // Multi-select
      if (Array.isArray(filterValue)) {
        if (filterValue.length === 0) return true;
        // Handle boolean yes/no filters
        if (typeof productValue === 'boolean') {
          const boolStrings = filterValue.map((v) => {
            if (v === 'Yes') return true;
            if (v === 'No') return false;
            return v;
          });
          return boolStrings.includes(productValue);
        }
        return filterValue.includes(productValue);
      }
      return true;
    });
  });

  return result;
}

const NO_RANGE: RangeFilter = {};
const NO_SELECTION: string[] = [];

export default function ProductList() {
  const [currentPage, setCurrentPage] = createSignal(0);
  const [pageSize, setPageSize] = createSignal(50);
  const [pending, startTransition] = useTransition();

  // Applying or clearing a filter also returns to the first page
  const filterStore = createFilterStore(() => startTransition(() => setCurrentPage(0)));

  // Refetches whenever the page or page size changes. No query()/preload: every page change
  // is exactly one products request. Page changes run in a transition, so the <Suspense> below
  // keeps the current rows on screen while `pending()` shows the overlay.
  // A failed request is returned as a value, so the memos below never throw.
  const productsData = createAsync((): Promise<ProductsPage> =>
    productService
      .getProductsByCategory('all', currentPage() + 1, pageSize())
      .catch((e): ProductsPage => ({ products: [], total: 0, error: e instanceof Error ? e.message : 'Failed to fetch products' }))
  );

  const products = () => productsData()?.products ?? [];
  const totalPages = createMemo(() => Math.ceil((productsData()?.total ?? 0) / pageSize()));
  const filteredProducts = createMemo(() => applyFilters(products(), filterStore.state.applied));

  const columnKeys = allColumns.map((col) => col.key);

  function getColumnTitle(key: string): string {
    return getColumnConfig(key as keyof MockProductViewModel)?.label ?? key;
  }

  function getColumnUnit(key: string): string | undefined {
    return getColumnConfig(key as keyof MockProductViewModel)?.unit;
  }

  function resetFilters() {
    filterStore.clear();
  }

  function handlePageChange(newPage: number) {
    startTransition(() => setCurrentPage(newPage));
  }

  function handlePageSizeChange(newSize: number) {
    startTransition(() => {
      setPageSize(newSize);
      setCurrentPage(0);
    });
  }

  function renderHeader(column: string) {
    return <strong>{getColumnTitle(column)}</strong>;
  }

  // The filter controls are generic and controlled: the page feeds each one its column's draft
  // and writes their changes back to the store (draft on every change, apply on commit).
  const draftOf = <T extends FilterValue>(column: string) => filterStore.state.draft[column] as T | undefined;

  function renderTextSearch(column: string) {
    return (
      <TextSearch
        value={draftOf<string>(column) ?? ''}
        onValueChange={(v) => filterStore.setDraft(column, v)}
        onCommit={() => filterStore.apply(column)}
      />
    );
  }

  function renderRangeSlider(column: string, min?: number, max?: number) {
    return (
      <RangeSlider
        value={draftOf<RangeFilter>(column) ?? NO_RANGE}
        min={min}
        max={max}
        onValueChange={(v) => filterStore.setDraft(column, v)}
        onCommit={() => filterStore.apply(column)}
      />
    );
  }

  function renderMultiSelect(column: string, options: string[]) {
    // Every toggle updates the selection and applies it immediately
    return (
      <MultiSelect
        options={options}
        value={draftOf<string[]>(column) ?? NO_SELECTION}
        onValueChange={(v) => {
          filterStore.setDraft(column, v);
          filterStore.apply(column);
        }}
      />
    );
  }

  function renderFilter(column: string) {
    switch (getColumnDataType(column as keyof MockProductViewModel)) {
      case 'progress-bar':
        return renderRangeSlider(column, 0, 100);
      case 'grade-badge':
        return renderMultiSelect(column, ['A', 'B', 'C', 'D', 'F']);
      case 'nova-dots':
        return renderMultiSelect(column, ['1', '2', '3', '4']);
      case 'large-counter':
        return renderRangeSlider(column);
      case 'boolean-yesno':
        return renderMultiSelect(column, ['Yes', 'No']);
      case 'product-image':
        return null;
      default:
        return renderTextSearch(column);
    }
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
        <Button class="reset-button" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>

      {/* First load: nothing to show yet */}
      <Suspense fallback={<div class="loading-indicator">Loading products...</div>}>
        {/* Reading productsData() here, inside <Suspense>, is what lets the page-change transition hold */}
        <Show when={productsData()}>
          <Switch fallback={<p>No products found.</p>}>
            <Match when={productsData()?.error}>
              <p>Error loading products: {productsData()?.error}</p>
            </Match>
            <Match when={products().length > 0}>
              <div class="table-area">
                {/* Page change in progress: the previous rows stay mounted (transition) under this overlay */}
                <Show when={pending()}>
                  <div class="loading-overlay">
                    <div class="loading-indicator">Loading...</div>
                  </div>
                </Show>
                <DataTable
                  columns={columnKeys}
                  value={filteredProducts()}
                  totalPages={totalPages()}
                  page={currentPage()}
                  pageSize={pageSize()}
                  pageSizes={[10, 25, 50]}
                  showFilterRow
                  trackBy="code"
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  renderHeader={renderHeader}
                  renderFilter={renderFilter}
                  renderCell={renderCell}
                />
              </div>
            </Match>
          </Switch>
        </Show>
      </Suspense>
    </div>
  );
}
