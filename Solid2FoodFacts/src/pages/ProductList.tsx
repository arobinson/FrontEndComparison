import { createSignal, createMemo, isPending, Errored, Loading, Show } from 'solid-js';
import type { MockProductViewModel } from 'shared-types';
import { allColumns, getColumnConfig, getColumnDataType } from 'shared-types';
import { productService } from '../services/productService';
import DataTable from '../components/shared/DataTable';
import CellRenderer from '../components/table/CellRenderer';
import { TextSearch, RangeSlider, MultiSelect, createFilterStore, FilterStoreContext } from '../components/filters';
import type { FilterValue } from '../components/filters';
import './ProductList.css';

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

export default function ProductList() {
  const [currentPage, setCurrentPage] = createSignal(0);
  const [pageSize, setPageSize] = createSignal(50);

  // Applying or clearing a filter also returns to the first page
  const filterStore = createFilterStore(() => setCurrentPage(0));

  // Async memo (Solid 2 replaces createResource/createAsync with async computations):
  // re-runs whenever the page or page size changes, so every page change is exactly one
  // products request. There are no explicit transitions in 2.0: once <Loading> below has shown
  // content, a page change keeps the current rows (and pager) on screen until the new page lands,
  // and isPending() drives the overlay meanwhile. A failed request rejects to <Errored>.
  const productsData = createMemo(() => productService.getProductsByCategory('all', currentPage() + 1, pageSize()));

  const products = () => productsData().products;
  const totalPages = createMemo(() => Math.ceil(productsData().total / pageSize()));
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
    switch (getColumnDataType(column as keyof MockProductViewModel)) {
      case 'progress-bar':
        return <RangeSlider column={column} min={0} max={100} />;
      case 'grade-badge':
        return <MultiSelect column={column} options={['A', 'B', 'C', 'D', 'F']} />;
      case 'nova-dots':
        return <MultiSelect column={column} options={['1', '2', '3', '4']} />;
      case 'large-counter':
        return <RangeSlider column={column} />;
      case 'boolean-yesno':
        return <MultiSelect column={column} options={['Yes', 'No']} />;
      case 'product-image':
        return null;
      default:
        return <TextSearch column={column} />;
    }
  }

  function renderCell(value: any, column: string, row: Record<string, any>) {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);
    const unit = getColumnUnit(column);
    return <CellRenderer value={value} dataType={dataType} column={column} row={row} unit={unit} />;
  }

  return (
    <FilterStoreContext value={filterStore}>
      <div class="product-list-container">
        <div class="page-header-row">
          <h1>Products</h1>
          <button class="reset-button" onClick={resetFilters} type="button">
            Reset Filters
          </button>
        </div>

        <Errored fallback={(err) => <p>Error loading products: {errorMessage(err())}</p>}>
          {/* First load: nothing to show yet */}
          <Loading fallback={<div class="loading-indicator">Loading products...</div>}>
            <Show when={products().length > 0} fallback={<p>No products found.</p>}>
              <div class="table-area">
                {/* Page change in flight: the previous rows stay on screen under this overlay */}
                <Show when={isPending(productsData)}>
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
                  showFilterRow={true}
                  trackBy="code"
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  renderHeader={renderHeader}
                  renderFilter={renderFilter}
                  renderCell={renderCell}
                />
              </div>
            </Show>
          </Loading>
        </Errored>
      </div>
    </FilterStoreContext>
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to fetch products';
}
