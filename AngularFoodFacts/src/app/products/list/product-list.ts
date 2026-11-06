import {
  Component,
  inject,
  signal,
  computed,
  linkedSignal,
  Signal,
} from '@angular/core';

import { allColumns, ColumnConfig, getColumnConfig } from 'shared-types';
import { FoodFacts, ProductViewModel } from '../food-facts';
import { DataTable } from '../../shared/data-table/data-table';
import { CellRenderer } from '../../shared/cell-renderer/cell-renderer';
import { AffButton } from '../../shared/aff-button/aff-button';
import { TextSearch } from '../../shared/filters/text-search/text-search';
import {
  RangeSlider,
  RangeValue,
} from '../../shared/filters/range-slider/range-slider';
import { MultiSelect } from '../../shared/filters/multi-select/multi-select';
import {
  FilterStore,
  FilterValue,
} from '../../shared/filters/filter-store';

interface ProductPage {
  products: ProductViewModel[];
  total: number;
}

@Component({
  selector: 'aff-product-list',
  imports: [
    AffButton,
    DataTable,
    CellRenderer,
    TextSearch,
    RangeSlider,
    MultiSelect,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  providers: [FilterStore],
})
export class ProductList {
  readonly #foodFacts = inject(FoodFacts);
  readonly #filters = inject(FilterStore);

  readonly category = signal('all');

  // #region Pagination State

  /**
   * Current page for pagination (0-based for UI, 1-based for API).
   * Resets to the first page whenever a filter is applied or cleared.
   */
  readonly currentPage = linkedSignal({
    source: this.#filters.applied,
    computation: () => 0,
  });

  /**
   * Items per page
   */
  readonly pageSize = signal(50);

  /**
   * API page (1-based) computed from currentPage (0-based)
   */
  readonly apiPage = computed(() => this.currentPage() + 1);

  readonly productsResource = this.#foodFacts.createProductsByCategoryResource(
    this.category,
    this.apiPage,
    this.pageSize,
  );

  // #endregion

  // #region Column Configuration (from shared-types)

  /**
   * Column configuration from shared-types
   */
  readonly columnConfig: ColumnConfig[] = allColumns;

  /**
   * Column keys for the data table
   */
  readonly columns = allColumns.map((col) => col.key);

  /**
   * Static per-column lookups (column config never changes), read as plain
   * properties in the template instead of method calls on every check
   */
  readonly columnTypes: Record<string, string> = Object.fromEntries(
    allColumns.map((col) => [col.key, getColumnConfig(col.key as keyof ProductViewModel)?.type ?? 'simple-text']),
  );
  readonly columnTitles: Record<string, string> = Object.fromEntries(
    allColumns.map((col) => [col.key, getColumnConfig(col.key as keyof ProductViewModel)?.label ?? col.key]),
  );

  // Filter option lists
  readonly gradeOptions = ['A', 'B', 'C', 'D', 'F'];
  readonly novaOptions = ['1', '2', '3', '4'];
  readonly yesNoOptions = ['Yes', 'No'];

  // #endregion

  // #region Filter State

  /**
   * Draft values bound to the filter controls. One store signal, viewed with
   * the value type of each control (a column only ever holds one type), so the
   * template reads a signal rather than calling a method per cell.
   */
  readonly textDrafts = this.#filters.drafts as Signal<
    Record<string, string | undefined>
  >;
  readonly rangeDrafts = this.#filters.drafts as Signal<
    Record<string, RangeValue | undefined>
  >;
  readonly multiDrafts = this.#filters.drafts as Signal<
    Record<string, string[] | undefined>
  >;

  setDraft(column: string, value: FilterValue) {
    this.#filters.setDraft(column, value);
  }

  applyFilter(column: string) {
    this.#filters.apply(column);
  }

  /** MultiSelect applies on every toggle */
  setAndApply(column: string, value: string[]) {
    this.#filters.setDraft(column, value);
    this.#filters.apply(column);
  }

  /**
   * Reset all filters (also returns to the first page, see currentPage)
   */
  resetFilters() {
    this.#filters.clear();
  }

  // #endregion

  // #region Computed Values

  readonly isLoading = computed(
    () => this.productsResource.status() === 'loading',
  );
  readonly isError = computed(() => this.productsResource.status() === 'error');

  /**
   * Current data, or the previous page's data while the next page loads
   */
  readonly displayData = linkedSignal<
    ProductPage | undefined,
    ProductPage | null
  >({
    source: () =>
      this.productsResource.hasValue()
        ? this.productsResource.value()
        : undefined,
    computation: (current, previous) => current ?? previous?.value ?? null,
  });

  readonly hasData = computed(() => {
    const data = this.displayData();
    return data && data.products.length > 0;
  });

  /**
   * Filtered data based on active filters (filters current page only)
   */
  readonly filteredData = computed(() => {
    const response = this.displayData();
    const allData = response?.products || [];
    const activeFilters: Record<string, any> = this.#filters.applied();

    let result = allData;
    if (Object.keys(activeFilters).length > 0) {
      result = allData.filter((product) => {
        let matches = true;
        for (const [column, filterValue] of Object.entries(activeFilters)) {
          if (!filterValue) continue;

          const productValue = (product as any)[column];

          // Text search
          if (typeof filterValue === 'string') {
            if (
              !productValue
                ?.toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase())
            ) {
              matches = false;
            }
          }
          // Range filter
          else if (
            filterValue.min !== undefined ||
            filterValue.max !== undefined
          ) {
            const numValue = Number(productValue);
            if (filterValue.min !== undefined && numValue < filterValue.min) {
              matches = false;
            }
            if (filterValue.max !== undefined && numValue > filterValue.max) {
              matches = false;
            }
          }
          // Multi-select
          else if (Array.isArray(filterValue)) {
            if (filterValue.length > 0) {
              // Handle boolean yes/no filters
              if (typeof productValue === 'boolean') {
                const boolStrings = filterValue.map((v) =>
                  (() => {
                    if (v === 'Yes') return true;
                    if (v === 'No') return false;
                    return v;
                  })(),
                );
                if (!boolStrings.includes(productValue)) {
                  matches = false;
                }
              } else if (!filterValue.includes(productValue)) {
                matches = false;
              }
            }
          }
        }
        return matches;
      });
    }
    return result;
  });

  /**
   * Current page data for the table (filtered current page)
   */
  readonly currentPageData = computed(() => {
    return this.filteredData();
  });

  /**
   * Total number of pages from server
   */
  readonly totalPages = computed(() => {
    const response = this.displayData();
    const total = response?.total || 0;
    return Math.ceil(total / this.pageSize());
  });

  // #endregion

  // #region Event Handlers

  /**
   * Handle page changes from the data table
   * @param newPage New page number
   */
  onPageChange(newPage: number) {
    this.currentPage.set(newPage);
  }

  /**
   * Handle page size changes from the data table
   * @param newPageSize New page size
   */
  onPageSizeChange(newPageSize: number) {
    this.pageSize.set(newPageSize);
    this.currentPage.set(0); // Reset to first page
  }

  // #endregion
}
