import { createSignal, createMemo, Match, Show, Suspense, Switch } from 'solid-js';
import { createAsync, useIsRouting, useLocation, useNavigate } from '@solidjs/router';
import type { ListQuery, MockProductViewModel } from 'shared-types';
import {
  allColumns,
  filterValuesEqual,
  getColumnConfig,
  getColumnDataType,
  listQuerySearch,
  parseListQuery,
  rememberedExpanded,
  rememberExpanded,
} from 'shared-types';
import { productService, type ProductsResponse } from '../services/productService';
import CellRenderer from '../components/table/CellRenderer';
import { Button, DataTable, TextSearch, RangeSlider, MultiSelect } from '../components/controls';
import { createFilterStore } from '../components/filters/filterStore';
import type { FilterValue, RangeFilter } from '../components/filters/filterStore';
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
  const location = useLocation();
  const navigate = useNavigate();
  // Paging and filtering are router navigations, which run in a transition (see productsData)
  const isRouting = useIsRouting();

  // Page, page size and applied filters live in the URL, so a reload, Back from a
  // product, or a shared link shows the same list.
  const query = createMemo(() => parseListQuery(location.search));
  const search = createMemo(() => listQuerySearch(query()));
  // Memos, so a filter change (same page and size) does not refetch the page
  const currentPage = createMemo(() => query().page);
  const pageSize = createMemo(() => query().pageSize);
  const applied = () => query().filters;

  // Page-scoped filter drafts; the filter controls are wired to them below
  const filterStore = createFilterStore();

  // Products whose description is expanded on this list view. Still open after a
  // visit to a product; a new page or filter starts with none (see showList).
  const [expandedCodes, setExpandedCodes] = createSignal<readonly string[]>(rememberedExpanded(search()));

  // Shows another list view. Replaces the history entry, so paging and filtering
  // don't stack up Back steps, and Back from a product returns here.
  function showList(next: ListQuery) {
    const nextSearch = listQuerySearch(next);
    if (nextSearch === search()) return;
    // A list view starts with nothing expanded
    setExpandedCodes([]);
    rememberExpanded(nextSearch, []);
    navigate(`/list${nextSearch}`, { replace: true, scroll: false });
  }

  // Applying a filter returns to the first page
  function applyFilter(column: string, value: FilterValue | undefined) {
    // A commit that changes nothing (e.g. blur without an edit) is a no-op, like a native change event
    if (filterValuesEqual(value, applied()[column])) return;
    showList({ ...query(), page: 0, filters: { ...applied(), [column]: value } });
  }

  function setExpanded(code: string, expanded: boolean) {
    const others = expandedCodes().filter((c) => c !== code);
    const codes = expanded ? [...others, code] : others;
    setExpandedCodes(codes);
    rememberExpanded(search(), codes);
  }

  // Refetches whenever the URL's page or page size changes. No query()/preload: every page change
  // is exactly one products request. Page changes are router navigations, which run in a
  // transition, so the <Suspense> below keeps the current rows on screen while `isRouting()` shows the overlay.
  // A failed request is returned as a value, so the memos below never throw.
  const productsData = createAsync((): Promise<ProductsPage> =>
    productService
      .getProductsByCategory('all', currentPage() + 1, pageSize())
      .catch((e): ProductsPage => ({ products: [], total: 0, error: e instanceof Error ? e.message : 'Failed to fetch products' }))
  );

  const products = () => productsData()?.products ?? [];
  const totalPages = createMemo(() => Math.ceil((productsData()?.total ?? 0) / pageSize()));
  const filteredProducts = createMemo(() => applyFilters(products(), applied()));

  const columnKeys = allColumns.map((col) => col.key);

  function getColumnTitle(key: string): string {
    return getColumnConfig(key as keyof MockProductViewModel)?.label ?? key;
  }

  function getColumnUnit(key: string): string | undefined {
    return getColumnConfig(key as keyof MockProductViewModel)?.unit;
  }

  function resetFilters() {
    filterStore.clear();
    showList({ ...query(), page: 0, filters: {} });
  }

  function handlePageChange(newPage: number) {
    showList({ ...query(), page: newPage });
  }

  // A new page size starts again from the first page
  function handlePageSizeChange(newSize: number) {
    showList({ ...query(), page: 0, pageSize: newSize });
  }

  function renderHeader(column: string) {
    return <strong>{getColumnTitle(column)}</strong>;
  }

  // The filter controls are generic and controlled: the page feeds each one its column's draft
  // (or applied value) and writes their changes back (draft on every change, apply on commit).
  const draftOf = <T extends FilterValue>(column: string) =>
    (filterStore.state.draft[column] ?? applied()[column]) as T | undefined;

  function renderTextSearch(column: string) {
    return (
      <TextSearch
        value={draftOf<string>(column) ?? ''}
        onValueChange={(v) => filterStore.setDraft(column, v)}
        onCommit={() => applyFilter(column, draftOf(column))}
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
        onCommit={() => applyFilter(column, draftOf(column))}
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
          applyFilter(column, v);
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
    return (
      <CellRenderer
        value={value}
        dataType={dataType}
        column={column}
        row={row}
        unit={unit}
        expanded={expandedCodes().includes(row.code)}
        onExpandedChange={(expanded) => setExpanded(row.code, expanded)}
      />
    );
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
                <Show when={isRouting()}>
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
