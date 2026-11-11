import {
  Component,
  inject,
  signal,
  computed,
  linkedSignal,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import {
  allColumns,
  filterValuesEqual,
  listQuerySearch,
  parseListQuery,
  rememberedExpanded,
  rememberExpanded,
  type ListQuery,
} from 'shared-types';
import { FoodFacts, ProductViewModel } from '../food-facts';
import { DataTable } from '../../controls/data-table/data-table';
import { CellRenderer } from '../../table/cell-renderer/cell-renderer';
import { AffButton } from '../../controls/aff-button/aff-button';
import { TextSearch } from '../../controls/text-search/text-search';
import {
  RangeSlider,
  RangeValue,
} from '../../controls/range-slider/range-slider';
import { MultiSelect } from '../../controls/multi-select/multi-select';
import {
  FilterMap,
  FilterStore,
  FilterValue,
} from '../../filters/filter-store';

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
  readonly #router = inject(Router);

  readonly category = signal('all');

  // #region URL State

  /**
   * Page, page size and applied filters live in the URL, so a reload, Back from
   * a product, or a shared link shows the same list.
   */
  readonly #queryParams = toSignal(inject(ActivatedRoute).queryParams, {
    requireSync: true,
  });

  readonly query = computed(() =>
    parseListQuery(new URLSearchParams(this.#queryParams())),
  );

  /** The URL query string of the list view being shown */
  readonly #search = computed(() => listQuerySearch(this.query()));

  /** Current page (0-based for UI, 1-based for API and URL) */
  readonly currentPage = computed(() => this.query().page);
  readonly pageSize = computed(() => this.query().pageSize);
  readonly applied = computed(() => this.query().filters);

  /**
   * API page (1-based) computed from currentPage (0-based)
   */
  readonly apiPage = computed(() => this.currentPage() + 1);

  readonly productsResource = this.#foodFacts.createProductsByCategoryResource(
    this.category,
    this.apiPage,
    this.pageSize,
  );

  /**
   * Shows another list view. Replaces the history entry, so paging and filtering
   * don't stack up Back steps, and Back from a product returns here.
   */
  #showList(query: ListQuery): void {
    const search = listQuerySearch(query);
    if (search === this.#search()) {
      return;
    }
    // A list view starts with nothing expanded
    this.expandedCodes.set([]);
    rememberExpanded(search, []);
    this.#router.navigateByUrl(`/list${search}`, { replaceUrl: true });
  }

  goToPage(page: number) {
    this.#showList({ ...this.query(), page });
  }

  /** A new page size starts again from the first page */
  setPageSize(pageSize: number) {
    this.#showList({ ...this.query(), page: 0, pageSize });
  }

  // #endregion

  // #region Column Configuration (from shared-types)

  /**
   * Column keys for the data table
   */
  readonly columns = allColumns.map((col) => col.key);

  /**
   * Static per-column lookups (column config never changes), read as plain
   * properties in the template instead of method calls on every check
   */
  readonly columnTypes: Record<string, string> = Object.fromEntries(
    allColumns.map((col) => [col.key, col.type]),
  );
  readonly columnTitles: Record<string, string> = Object.fromEntries(
    allColumns.map((col) => [col.key, col.label]),
  );

  // Filter option lists
  readonly gradeOptions = ['A', 'B', 'C', 'D', 'F'];
  readonly novaOptions = ['1', '2', '3', '4'];
  readonly yesNoOptions = ['Yes', 'No'];

  // #endregion

  // #region Filter State

  /**
   * What each filter control shows: its draft while being edited, otherwise the
   * applied value from the URL. One signal, viewed with the value type of each
   * control (a column only ever holds one type), so the template reads a signal
   * rather than calling a method per cell.
   */
  readonly #shown = computed<FilterMap>(() => ({
    ...this.applied(),
    ...this.#filters.drafts(),
  }));

  readonly textDrafts = this.#shown as Signal<
    Record<string, string | undefined>
  >;
  readonly rangeDrafts = this.#shown as Signal<
    Record<string, RangeValue | undefined>
  >;
  readonly multiDrafts = this.#shown as Signal<
    Record<string, string[] | undefined>
  >;

  setDraft(column: string, value: FilterValue) {
    this.#filters.setDraft(column, value);
  }

  /** Applies a control's value; applying a filter returns to the first page */
  applyFilter(column: string) {
    const value = this.#shown()[column];
    // A commit that changes nothing (e.g. blur without an edit) is a no-op, like a native change event
    if (filterValuesEqual(value, this.applied()[column])) {
      return;
    }
    this.#showList({
      ...this.query(),
      page: 0,
      filters: { ...this.applied(), [column]: value },
    });
  }

  /** MultiSelect applies on every toggle */
  setAndApply(column: string, value: string[]) {
    this.#filters.setDraft(column, value);
    this.applyFilter(column);
  }

  /**
   * Reset all filters and return to the first page
   */
  resetFilters() {
    this.#filters.clear();
    this.#showList({ ...this.query(), page: 0, filters: {} });
  }

  // #endregion

  // #region Expanded Products

  /**
   * Products whose description is expanded on this list view. Still open after
   * a visit to a product; a new page or filter starts with none (see #navigate).
   */
  readonly expandedCodes = signal<readonly string[]>(
    rememberedExpanded(this.#search()),
  );

  setExpanded(code: string, expanded: boolean) {
    const others = this.expandedCodes().filter((c) => c !== code);
    const codes = expanded ? [...others, code] : others;
    this.expandedCodes.set(codes);
    rememberExpanded(this.#search(), codes);
  }

  // #endregion

  // #region Computed Values

  readonly isLoading = this.productsResource.isLoading;
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
    const activeFilters: Record<string, any> = this.applied();

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
   * Total number of pages from server
   */
  readonly totalPages = computed(() => {
    const response = this.displayData();
    const total = response?.total || 0;
    return Math.ceil(total / this.pageSize());
  });

  // #endregion
}
