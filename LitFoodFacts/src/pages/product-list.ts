import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Task, TaskStatus } from '@lit/task';
import type { MockProductViewModel } from 'shared-types';
import { allColumns, getColumnConfig, getColumnDataType } from 'shared-types';
import { productService, type ProductsResponse } from '../services/productService.js';
import { FilterStore, FilterStoreController, type FilterValue } from '../components/filters/filter-store.js';
import type { RangeValue } from '../components/controls/range-slider.js';
import '../components/shared/data-table.js';
import '../components/shared/lit-button.js';
import '../components/table/cell-renderer.js';
import '../components/controls/index.js';
import '../components/display/index.js';

const NO_RANGE: RangeValue = {};
const NO_SELECTION: string[] = [];
const GRADE_OPTIONS = ['A', 'B', 'C', 'D', 'F'];
const NOVA_OPTIONS = ['1', '2', '3', '4'];
const YES_NO_OPTIONS = ['Yes', 'No'];

@customElement('product-list')
export class ProductList extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .product-list-container {
      padding: 1.25rem;
      height: calc(100vh - 41px); /* Account for framework header */
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }

    .page-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      flex-shrink: 0;
    }

    .page-header-row h1 {
      color: #333;
      margin: 0;
    }

    .table-area {
      position: relative;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      border-radius: 8px;
    }

    .loading-indicator {
      padding: 0.5rem 1rem;
      background-color: #f0f8ff;
      border-left: 4px solid #0066cc;
      margin-bottom: 1rem;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
    }

    data-table {
      flex: 1;
      min-height: 0;
    }
  `;

  @state() private currentPage = 0;
  @state() private pageSize = 50;

  // Page-scoped filter store: owned by this page, which wires it to the (store-agnostic)
  // filter controls in renderFilterCell. Any apply/clear returns to the first page (in the same event), as in the other apps.
  private filters = new FilterStore(() => {
    this.currentPage = 0;
  });

  // One products request per page / page-size change. The signal is deliberately not
  // passed to fetch, so a superseded request still completes (same network trace as before).
  private productsTask = new Task(this, {
    task: ([page, pageSize]) => productService.getProductsByCategory('all', page + 1, pageSize),
    args: () => [this.currentPage, this.pageSize] as const,
    onComplete: (result) => {
      this.lastLoaded = result;
    },
  });

  // Last successful page. Task.value keeps it while the next page is pending but drops it
  // on error; this keeps it so a retry after an error still shows the previous rows.
  private lastLoaded?: ProductsResponse;

  // Derived in willUpdate (memoized on the data and the applied filters).
  private displayProducts: MockProductViewModel[] = [];
  private displayBase?: MockProductViewModel[];
  private displayFilters?: Readonly<Record<string, FilterValue | undefined>>;

  // <data-table> renders the filter row only when one of its properties changes, so the
  // filter renderer gets a new identity whenever the drafts change (memoized in willUpdate);
  // that is how a draft reaches its control's `value`.
  private renderFilter = (column: string) => this.renderFilterCell(column);
  private renderFilterDrafts?: Readonly<Record<string, FilterValue | undefined>>;

  private columnKeys = allColumns.map((col) => col.key);

  constructor() {
    super();
    new FilterStoreController(this, this.filters);
  }

  private get loaded(): ProductsResponse | undefined {
    return this.productsTask.value ?? this.lastLoaded;
  }

  private get totalPages(): number {
    return Math.ceil((this.loaded?.total ?? 0) / this.pageSize);
  }

  private getColumnTitle(key: string): string {
    return getColumnConfig(key as keyof MockProductViewModel)?.label ?? key;
  }

  private getColumnUnit(key: string): string | undefined {
    return getColumnConfig(key as keyof MockProductViewModel)?.unit;
  }

  willUpdate() {
    const base = this.loaded?.products ?? [];
    const applied = this.filters.applied;
    if (base !== this.displayBase || applied !== this.displayFilters) {
      this.displayBase = base;
      this.displayFilters = applied;
      this.displayProducts = this.applyFilters(base);
    }
    const drafts = this.filters.drafts;
    if (drafts !== this.renderFilterDrafts) {
      this.renderFilterDrafts = drafts;
      this.renderFilter = (column: string) => this.renderFilterCell(column);
    }
  }

  /**
   * Apply client-side filters to the products
   */
  private applyFilters(products: MockProductViewModel[]): MockProductViewModel[] {
    const activeFilters: Record<string, unknown> = this.filters.applied;
    if (Object.keys(activeFilters).length === 0) {
      return products;
    }

    return products.filter((product) => {
      for (const [column, filterValue] of Object.entries(activeFilters)) {
        if (!filterValue) continue;

        const productValue = (product as unknown as Record<string, unknown>)[column];

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
              const boolStrings = filterValue.map((v) => {
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

  private resetFilters() {
    this.filters.clear();
  }

  private handlePageChange(e: CustomEvent<number>) {
    this.currentPage = e.detail;
  }

  private handlePageSizeChange(e: CustomEvent<number>) {
    this.pageSize = e.detail;
    this.currentPage = 0;
  }

  private renderHeader = (column: string): TemplateResult => {
    return html`<strong>${this.getColumnTitle(column)}</strong>`;
  };

  // Wires each generic control to the store: value <- draft; value-change -> setDraft;
  // commit -> apply. A multi-select applies on every toggle.
  private renderFilterCell(column: string): TemplateResult | null {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);
    const filters = this.filters;

    if (dataType === 'progress-bar' || dataType === 'large-counter') {
      const value = filters.getDraft<RangeValue>(column) ?? NO_RANGE;
      const onValueChange = (e: CustomEvent<RangeValue>) => filters.setDraft(column, e.detail);
      const onCommit = () => filters.apply(column);
      return dataType === 'progress-bar'
        ? html`
            <range-slider
              min="0"
              max="100"
              .value=${value}
              @value-change=${onValueChange}
              @commit=${onCommit}
            ></range-slider>
          `
        : html`
            <range-slider
              .value=${value}
              @value-change=${onValueChange}
              @commit=${onCommit}
            ></range-slider>
          `;
    }
    const options =
      dataType === 'grade-badge' ? GRADE_OPTIONS
      : dataType === 'nova-dots' ? NOVA_OPTIONS
      : dataType === 'boolean-yesno' ? YES_NO_OPTIONS
      : undefined;
    if (options) {
      return html`
        <multi-select
          .options=${options}
          .value=${filters.getDraft<string[]>(column) ?? NO_SELECTION}
          @value-change=${(e: CustomEvent<string[]>) => {
            filters.setDraft(column, e.detail);
            filters.apply(column);
          }}
        ></multi-select>
      `;
    }
    if (dataType !== 'product-image') {
      return html`
        <text-search
          .value=${filters.getDraft<string>(column) ?? ''}
          @value-change=${(e: CustomEvent<string>) => filters.setDraft(column, e.detail)}
          @commit=${() => filters.apply(column)}
        ></text-search>
      `;
    }
    return null;
  }

  private renderCell = (value: unknown, column: string, row: Record<string, unknown>): TemplateResult => {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);
    const unit = this.getColumnUnit(column);
    return html`<cell-renderer .value=${value} .dataType=${dataType} .column=${column} .row=${row} .unit=${unit}></cell-renderer>`;
  };

  // Same branches as the other apps: error, else the table once a page has loaded (kept,
  // with an overlay, while the next page loads; filtered to zero rows it shows its empty
  // state), else the initial loading message, else "No products found."
  private renderContent(): TemplateResult {
    const status = this.productsTask.status;
    if (status === TaskStatus.ERROR) {
      const error = this.productsTask.error;
      return html`<p>Error loading products: ${error instanceof Error ? error.message : 'Failed to fetch products'}</p>`;
    }
    const loading = status === TaskStatus.PENDING || status === TaskStatus.INITIAL;
    if ((this.loaded?.products.length ?? 0) > 0) {
      return html`
        <div class="table-area">
          ${loading
            ? html`
                <div class="loading-overlay">
                  <div class="loading-indicator">Loading...</div>
                </div>
              `
            : ''}
          <data-table
            .columns=${this.columnKeys}
            .value=${this.displayProducts}
            .totalPages=${this.totalPages}
            .page=${this.currentPage}
            .pageSize=${this.pageSize}
            show-filter-row
            trackBy="code"
            .renderHeader=${this.renderHeader}
            .renderFilter=${this.renderFilter}
            .renderCell=${this.renderCell}
            @page-change=${this.handlePageChange}
            @page-size-change=${this.handlePageSizeChange}
          ></data-table>
        </div>
      `;
    }
    if (loading) {
      return html`<div class="loading-indicator">Loading products...</div>`;
    }
    return html`<p>No products found.</p>`;
  }

  render() {
    return html`
      <div class="product-list-container">
        <div class="page-header-row">
          <h1>Products</h1>
          <lit-button extra-class="reset-button" @button-click=${this.resetFilters}>Reset Filters</lit-button>
        </div>

        ${this.renderContent()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'product-list': ProductList;
  }
}
