import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { allColumns, ColumnConfig, getColumnConfig } from 'shared-types';
import { FoodFacts, ProductViewModel } from '../food-facts';
import { DataTable } from '../../shared/data-table/data-table';
import { ProductLink } from '../../shared/product-link/product-link';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { GradeBadge } from '../../shared/grade-badge/grade-badge';
import { NovaDots } from '../../shared/nova-dots/nova-dots';
import { TruncatedText } from '../../shared/truncated-text/truncated-text';
import { LargeCounter } from '../../shared/large-counter/large-counter';
import { BooleanYesno } from '../../shared/boolean-yesno/boolean-yesno';
import { ProductImage } from '../../shared/product-image/product-image';
import { DecimalUnits } from '../../shared/decimal-units/decimal-units';
import { AbsoluteDate } from '../../shared/absolute-date/absolute-date';
import { RelativeDate } from '../../shared/relative-date/relative-date';
import { TimeFormat } from '../../shared/time-format/time-format';
import { TextSearch } from '../../shared/filters/text-search/text-search';
import { RangeSlider } from '../../shared/filters/range-slider/range-slider';
import { MultiSelect } from '../../shared/filters/multi-select/multi-select';

@Component({
  selector: 'aff-product-list',
  imports: [
    CommonModule,
    RouterModule,
    DataTable,
    ProductLink,
    ProgressBar,
    GradeBadge,
    NovaDots,
    TruncatedText,
    LargeCounter,
    BooleanYesno,
    ProductImage,
    DecimalUnits,
    AbsoluteDate,
    RelativeDate,
    TimeFormat,
    TextSearch,
    RangeSlider,
    MultiSelect,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  readonly #foodFacts = inject(FoodFacts);

  readonly category = signal('all');

  // #region Pagination State

  /**
   * Current page for pagination (0-based for UI, 1-based for API)
   */
  readonly currentPage = signal(0);

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

  /**
   * Previous data to show while loading new page
   */
  readonly previousData = signal<{
    products: ProductViewModel[];
    total: number;
  } | null>(null);

  constructor() {
    // Update previousData whenever we get new resolved data
    effect(() => {
      const status = this.productsResource.status();
      const value = this.productsResource.value();
      if (status === 'resolved' && value) {
        this.previousData.set(value);
      }
    });
  }

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
   * Get data type for a specific column
   */
  getColumnDataType(column: string): string {
    return getColumnConfig(column as keyof ProductViewModel)?.type ?? 'simple-text';
  }

  /**
   * Get label for a specific column
   */
  getColumnTitle(column: string): string {
    return getColumnConfig(column as keyof ProductViewModel)?.label ?? column;
  }

  // #endregion

  // #region Filter State

  readonly filters = signal<Record<string, any>>({});
  readonly filterResetTrigger = signal(0);

  /**
   * Update filter for a specific column
   */
  updateFilter(column: string, value: any) {
    this.filters.update((current) => ({
      ...current,
      [column]: value,
    }));
    this.currentPage.set(0); // Reset to first page when filtering
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.filters.set({});
    this.currentPage.set(0);
    this.filterResetTrigger.update((val) => val + 1);
  }

  // #endregion

  // #region Computed Values

  readonly isLoading = computed(
    () => this.productsResource.status() === 'loading',
  );
  readonly isError = computed(() => this.productsResource.status() === 'error');

  /**
   * Current data or previous data if loading
   */
  readonly displayData = computed(() => {
    const current = this.productsResource.value();
    const previous = this.previousData();
    let result;
    if (current) {
      result = current;
    } else {
      result = previous;
    }
    return result;
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
    const activeFilters = this.filters();

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
