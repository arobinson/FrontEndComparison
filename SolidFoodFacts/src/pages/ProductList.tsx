import { createSignal, createMemo, createResource, Show } from 'solid-js';
import type { MockProductViewModel } from 'shared-types';
import { allColumns, getColumnConfig, getColumnDataType } from 'shared-types';
import { productService } from '../services/productService';
import DataTable from '../components/shared/DataTable';
import CellRenderer from '../components/table/CellRenderer';
import { TextSearch, RangeSlider, MultiSelect } from '../components/filters';
import './ProductList.css';

export default function ProductList() {
  const [currentPage, setCurrentPage] = createSignal(0);
  const [pageSize, setPageSize] = createSignal(50);
  const [filterResetTrigger, setFilterResetTrigger] = createSignal(0);
  const [filters, setFilters] = createSignal<Record<string, any>>({});

  // Use createResource for data fetching - automatically handles loading/error states
  // and re-fetches when the source signal changes
  const [productsData] = createResource(
    () => ({ page: currentPage(), size: pageSize() }),
    async (params) => {
      const result = await productService.getProductsByCategory('all', params.page + 1, params.size);
      return result;
    }
  );

  // Apply client-side filters
  function applyFilters(productList: MockProductViewModel[]): MockProductViewModel[] {
    const activeFilters = filters();
    if (Object.keys(activeFilters).length === 0) {
      return productList;
    }

    return productList.filter((product) => {
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
  }

  // Computed values derived from resource
  const products = () => productsData()?.products;
  const totalProducts = () => productsData()?.total ?? 0;

  // Computed values for display with filters applied
  const displayProducts = createMemo(() => {
    const productList = products();
    return productList ? applyFilters(productList) : undefined;
  });

  // Column keys for the table
  const columnKeys = allColumns.map((col) => col.key);

  // Computed values
  const totalPages = createMemo(() => Math.ceil(totalProducts() / pageSize()));

  // Helper functions
  function getColumnTitle(key: string): string {
    return getColumnConfig(key as keyof MockProductViewModel)?.label ?? key;
  }

  function getColumnUnit(key: string): string | undefined {
    return getColumnConfig(key as keyof MockProductViewModel)?.unit;
  }

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
      return <RangeSlider min={0} max={100} resetTrigger={filterResetTrigger()} onValueChange={(v) => updateFilter(column, v)} />;
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
        <MultiSelect options={['1', '2', '3', '4']} resetTrigger={filterResetTrigger()} onValueChange={(v) => updateFilter(column, v)} />
      );
    }
    if (dataType === 'boolean-yesno') {
      return <MultiSelect options={['Yes', 'No']} resetTrigger={filterResetTrigger()} onValueChange={(v) => updateFilter(column, v)} />;
    }
    if (dataType === 'large-counter') {
      return <RangeSlider resetTrigger={filterResetTrigger()} onValueChange={(v) => updateFilter(column, v)} />;
    }
    if (dataType !== 'product-image') {
      return <TextSearch resetTrigger={filterResetTrigger()} onValueChange={(v) => updateFilter(column, v)} />;
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

      <div class="table-area">
        <Show when={productsData.loading}>
          <div class="loading-overlay">
            <span class="loading-indicator">⏳ Loading...</span>
          </div>
        </Show>

        <Show when={displayProducts()?.length}>
          <DataTable
            columns={columnKeys}
            value={displayProducts()!}
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

        <Show when={productsData.error}>
          <p class="error-message">Error loading products: {productsData.error?.message ?? 'Unknown'}</p>
        </Show>

        <Show when={!productsData.loading && !displayProducts()?.length}>
          <p>No products found.</p>
        </Show>
      </div>
    </div>
  );
}
