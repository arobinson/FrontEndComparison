import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Task, TaskStatus } from '@lit/task';
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
import { productService, type ProductsResponse } from '../services/productService.js';
import { FilterStore, FilterStoreController, type FilterValue } from '../components/filters/filter-store.js';
import type { RangeValue } from '../components/controls/range-slider.js';
import '../components/table/cell-renderer.js';
import '../components/controls/index.js';

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

  /**
   * The URL query string. Page, page size and applied filters live in the URL, so a
   * reload, Back from a product, or a shared link shows the same list.
   */
  @property({ attribute: false }) search = '';

  // Derived from `search` in willUpdate
  private query: ListQuery = parseListQuery('');

  private get currentPage(): number {
    return this.query.page;
  }

  private get pageSize(): number {
    return this.query.pageSize;
  }

  private get applied() {
    return this.query.filters;
  }

  // Page-scoped filter drafts: owned by this page, which wires them to the (store-agnostic)
  // filter controls in renderFilterCell.
  private filters = new FilterStore();

  // Products whose description is expanded on this list view. Still open after a
  // visit to a product; a new page or filter starts with none (see showList).
  @state() private expandedCodes: readonly string[] = [];

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

  // <data-table> renders the filter row and the cells only when one of its properties changes,
  // so the filter renderer gets a new identity whenever what the controls show changes, and the
  // cell renderer whenever the expanded products change (memoized in willUpdate).
  private renderFilter = (column: string) => this.renderFilterCell(column);
  private renderFilterDrafts?: Readonly<Record<string, FilterValue | undefined>>;
  private renderFilterQuery?: ListQuery;
  private renderCell = (value: unknown, column: string, row: Record<string, unknown>) =>
    this.renderCellFor(value, column, row);
  private renderCellExpanded?: readonly string[];

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

  willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has('search')) {
      this.query = parseListQuery(this.search);
      if (!this.hasUpdated) {
        // First render only: after that, the handlers below keep it current
        this.expandedCodes = rememberedExpanded(this.search);
      }
    }
    const base = this.loaded?.products ?? [];
    const applied = this.applied;
    if (base !== this.displayBase || applied !== this.displayFilters) {
      this.displayBase = base;
      this.displayFilters = applied;
      this.displayProducts = this.applyFilters(base);
    }
    const drafts = this.filters.drafts;
    if (drafts !== this.renderFilterDrafts || this.query !== this.renderFilterQuery) {
      this.renderFilterDrafts = drafts;
      this.renderFilterQuery = this.query;
      this.renderFilter = (column: string) => this.renderFilterCell(column);
    }
    if (this.expandedCodes !== this.renderCellExpanded) {
      this.renderCellExpanded = this.expandedCodes;
      this.renderCell = (value, column, row) => this.renderCellFor(value, column, row);
    }
  }

  /**
   * Apply client-side filters to the products
   */
  private applyFilters(products: MockProductViewModel[]): MockProductViewModel[] {
    const activeFilters: Record<string, unknown> = this.applied;
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

  // Shows another list view. The app replaces the history entry for the list's own
  // navigations, so paging and filtering don't stack up Back steps, and Back from a
  // product returns here.
  private showList(next: ListQuery) {
    const nextSearch = listQuerySearch(next);
    if (nextSearch === listQuerySearch(this.query)) return;
    // A list view starts with nothing expanded
    this.expandedCodes = [];
    rememberExpanded(nextSearch, []);
    this.dispatchEvent(new CustomEvent('navigate', { detail: `/list${nextSearch}` }));
  }

  // Applying a filter returns to the first page
  private applyFilter(column: string, value: FilterValue | undefined) {
    // A commit that changes nothing (e.g. blur without an edit) is a no-op, like a native change event
    if (filterValuesEqual(value, this.applied[column])) return;
    this.showList({ ...this.query, page: 0, filters: { ...this.applied, [column]: value } });
  }

  private resetFilters() {
    this.filters.clear();
    this.showList({ ...this.query, page: 0, filters: {} });
  }

  private handlePageChange(e: CustomEvent<number>) {
    this.showList({ ...this.query, page: e.detail });
  }

  // A new page size starts again from the first page
  private handlePageSizeChange(e: CustomEvent<number>) {
    this.showList({ ...this.query, page: 0, pageSize: e.detail });
  }

  private setExpanded(code: string, expanded: boolean) {
    const others = this.expandedCodes.filter((c) => c !== code);
    const codes = expanded ? [...others, code] : others;
    this.expandedCodes = codes;
    rememberExpanded(listQuerySearch(this.query), codes);
  }

  // What a control shows: its draft while being edited, otherwise the applied value
  private shown<T extends FilterValue>(column: string): T | undefined {
    return (this.filters.drafts[column] ?? this.applied[column]) as T | undefined;
  }

  private renderHeader = (column: string): TemplateResult => {
    return html`<strong>${this.getColumnTitle(column)}</strong>`;
  };

  // Wires each generic control to the page: value <- draft (or applied value);
  // value-change -> setDraft; commit -> apply. A multi-select applies on every toggle.
  private renderFilterCell(column: string): TemplateResult | null {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);
    const filters = this.filters;

    if (dataType === 'progress-bar' || dataType === 'large-counter') {
      const value = this.shown<RangeValue>(column) ?? NO_RANGE;
      const onValueChange = (e: CustomEvent<RangeValue>) => filters.setDraft(column, e.detail);
      const onCommit = () => this.applyFilter(column, this.shown(column));
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
          .value=${this.shown<string[]>(column) ?? NO_SELECTION}
          @value-change=${(e: CustomEvent<string[]>) => {
            filters.setDraft(column, e.detail);
            this.applyFilter(column, e.detail);
          }}
        ></multi-select>
      `;
    }
    if (dataType !== 'product-image') {
      return html`
        <text-search
          .value=${this.shown<string>(column) ?? ''}
          @value-change=${(e: CustomEvent<string>) => filters.setDraft(column, e.detail)}
          @commit=${() => this.applyFilter(column, this.shown(column))}
        ></text-search>
      `;
    }
    return null;
  }

  private renderCellFor(value: unknown, column: string, row: Record<string, unknown>): TemplateResult {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);
    const unit = this.getColumnUnit(column);
    const code = String(row.code);
    return html`<cell-renderer
      .value=${value}
      .dataType=${dataType}
      .unit=${unit}
      .expanded=${this.expandedCodes.includes(code)}
      @expanded-change=${(e: CustomEvent<boolean>) => this.setExpanded(code, e.detail)}
    ></cell-renderer>`;
  }

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
