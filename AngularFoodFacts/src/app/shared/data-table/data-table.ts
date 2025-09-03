import {
  Component,
  input,
  model,
  contentChild,
  TemplateRef,
  computed,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AffButton } from '../aff-button/aff-button';

@Component({
  selector: 'aff-data-table',
  imports: [NgTemplateOutlet, FormsModule, AffButton],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable {
  // #region Input Signals

  /**
   * Array of column names to display in the table
   */
  readonly columns = input.required<string[]>();

  /**
   * Pre-paginated array of data objects to display
   */
  readonly value = input.required<any[]>();

  /**
   * Total number of pages available for pagination
   */
  readonly totalPages = input.required<number>();

  /**
   * Text to display when no data is available
   */
  readonly emptyText = input<string>('No data available');

  /**
   * Whether to render the filter row below headers
   */
  readonly renderFilter = input<boolean>(false);

  /**
   * Available page size options for the dropdown
   */
  readonly pageSizes = input<number[]>([10, 25, 50]);

  // #endregion

  // #region Two-way Bound Signals

  /**
   * Current page number (0-based)
   */
  readonly page = model<number>(0);

  /**
   * Number of items to display per page
   */
  readonly pageSize = model<number>(50);

  // #endregion

  // #region Content Child Templates

  /**
   * Template for customizing column headers
   */
  readonly headerTemplate = contentChild<TemplateRef<any>>('header');

  /**
   * Template for customizing filter row cells
   */
  readonly filterTemplate = contentChild<TemplateRef<any>>('filter');

  /**
   * Template for customizing data cells
   */
  readonly dataTemplate = contentChild<TemplateRef<any>>('data');

  /**
   * Template for customizing empty state display
   */
  readonly emptyTemplate = contentChild<TemplateRef<any>>('empty');

  // #endregion

  // #region Computed Signals

  /**
   * Whether the table has data to display
   */
  readonly hasData = computed(() => {
    const data = this.value();
    return !!data?.length;
  });

  /**
   * Validates that pageSize is one of the allowed pageSizes options
   */
  readonly isValidPageSize = computed(() => {
    const pageSize = this.pageSize();
    const allowedSizes = this.pageSizes();
    return allowedSizes.includes(pageSize);
  });

  // #endregion

  // #region Event Handlers

  /**
   * Navigate to a specific page if within valid bounds
   * @param newPage The target page number (0-based)
   */
  onPageChange(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page.set(newPage);
    }
  }

  /**
   * Navigate to the first page
   */
  onFirstPage() {
    this.onPageChange(0);
  }

  /**
   * Navigate to the previous page
   */
  onPreviousPage() {
    this.onPageChange(this.page() - 1);
  }

  /**
   * Navigate to the next page
   */
  onNextPage() {
    this.onPageChange(this.page() + 1);
  }

  /**
   * Navigate to the last page
   */
  onLastPage() {
    this.onPageChange(this.totalPages() - 1);
  }

  /**
   * Change page size and reset to first page
   * @param newPageSize The new number of items per page
   */
  onPageSizeChange(newPageSize: number) {
    this.pageSize.set(newPageSize);
    this.page.set(0);
  }

  // #endregion
}
