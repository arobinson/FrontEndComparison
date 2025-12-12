import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { MockProductViewModel } from 'shared-types';
import { allColumns, getColumnConfig, getColumnDataType } from 'shared-types';
import { productService } from '../services/productService.js';
import '../components/shared/data-table.js';
import '../components/table/cell-renderer.js';
import '../components/filters/index.js';
import '../components/display/index.js';

@customElement('product-list')
export class ProductList extends LitElement {
  static styles = css`
    :host {
      display: block;
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

    .reset-button {
      padding: 8px 16px;
      background-color: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .reset-button:hover {
      background-color: #004499;
    }

    .reset-button:active {
      transform: translateY(1px);
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
      padding: 0.75rem 1.5rem;
      background-color: #f0f8ff;
      border-left: 4px solid #0066cc;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .error-message {
      color: #dc3545;
      padding: 1rem;
    }

    data-table {
      flex: 1;
      min-height: 0;
    }
  `;

  @state() private products: MockProductViewModel[] = [];
  @state() private productsState: 'initial' | 'loading' | 'error' | 'loaded' = 'initial';
  @state() private currentPage = 0;
  @state() private pageSize = 50;
  @state() private totalProducts = 0;
  @state() private error: Error | null = null;
  @state() private filterResetTrigger = 0;
  @state() private filters: Record<string, unknown> = {};

  // Keep previous data during loading to prevent table destruction
  private previousProducts: MockProductViewModel[] = [];
  private previousTotalProducts = 0;

  private columnKeys = allColumns.map(col => col.key);

  connectedCallback() {
    super.connectedCallback();
    this.loadProducts();
  }

  private get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  private getColumnTitle(key: string): string {
    return getColumnConfig(key as keyof MockProductViewModel)?.label ?? key;
  }

  private getColumnUnit(key: string): string | undefined {
    return getColumnConfig(key as keyof MockProductViewModel)?.unit;
  }

  // Computed values for display (use previous data during loading)
  private get displayProducts(): MockProductViewModel[] {
    return this.products.length > 0 ? this.products : this.previousProducts;
  }

  private get displayTotal(): number {
    return this.totalProducts > 0 ? this.totalProducts : this.previousTotalProducts;
  }

  private async loadProducts() {
    try {
      this.productsState = 'loading';
      const result = await productService.getProductsByCategory('all', this.currentPage + 1, this.pageSize);
      this.products = result.products;
      this.totalProducts = result.total;
      // Store as previous for next loading state
      this.previousProducts = result.products;
      this.previousTotalProducts = result.total;
      this.productsState = 'loaded';
    } catch (e) {
      this.error = e instanceof Error ? e : new Error('An unknown error occurred');
      this.productsState = 'error';
    }
  }

  private updateFilter(column: string, value: unknown) {
    this.filters = { ...this.filters, [column]: value };
  }

  private resetFilters() {
    this.filters = {};
    this.filterResetTrigger++;
  }

  private handlePageChange(e: CustomEvent<number>) {
    this.currentPage = e.detail;
    this.loadProducts();
  }

  private handlePageSizeChange(e: CustomEvent<number>) {
    this.pageSize = e.detail;
    this.currentPage = 0;
    this.loadProducts();
  }

  private renderHeader = (column: string): TemplateResult => {
    return html`<strong>${this.getColumnTitle(column)}</strong>`;
  };

  private renderFilter = (column: string): TemplateResult | null => {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);

    if (dataType === 'progress-bar') {
      return html`
        <range-slider
          min="0"
          max="100"
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${(e: CustomEvent) => this.updateFilter(column, e.detail)}
        ></range-slider>
      `;
    }
    if (dataType === 'grade-badge') {
      return html`
        <multi-select
          .options=${['A', 'B', 'C', 'D', 'E', 'F']}
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${(e: CustomEvent) => this.updateFilter(column, e.detail)}
        ></multi-select>
      `;
    }
    if (dataType === 'nova-dots') {
      return html`
        <multi-select
          .options=${['1', '2', '3', '4']}
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${(e: CustomEvent) => this.updateFilter(column, e.detail)}
        ></multi-select>
      `;
    }
    if (dataType === 'boolean-yesno') {
      return html`
        <multi-select
          .options=${['Yes', 'No']}
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${(e: CustomEvent) => this.updateFilter(column, e.detail)}
        ></multi-select>
      `;
    }
    if (dataType === 'large-counter') {
      return html`
        <range-slider
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${(e: CustomEvent) => this.updateFilter(column, e.detail)}
        ></range-slider>
      `;
    }
    if (dataType !== 'product-image') {
      return html`
        <text-search
          .resetTrigger=${this.filterResetTrigger}
          @value-change=${(e: CustomEvent) => this.updateFilter(column, e.detail)}
        ></text-search>
      `;
    }
    return null;
  };

  private renderCell = (value: unknown, column: string, row: Record<string, unknown>): TemplateResult => {
    const dataType = getColumnDataType(column as keyof MockProductViewModel);
    const unit = this.getColumnUnit(column);
    return html`<cell-renderer .value=${value} .dataType=${dataType} .column=${column} .row=${row} .unit=${unit}></cell-renderer>`;
  };

  render() {
    return html`
      <div class="page-header-row">
        <h1>Products</h1>
        <button class="reset-button" @click=${this.resetFilters} type="button">
          Reset Filters
        </button>
      </div>

      <div class="table-area">
        ${this.productsState === 'loading' ? html`
          <div class="loading-overlay">
            <span class="loading-indicator">⏳ Loading...</span>
          </div>
        ` : ''}

        ${this.displayProducts.length > 0 ? html`
          <data-table
            .columns=${this.columnKeys}
            .value=${this.displayProducts}
            .totalPages=${this.totalPages}
            .page=${this.currentPage}
            .pageSize=${this.pageSize}
            .showFilterRow=${true}
            trackBy="code"
            .renderHeader=${this.renderHeader}
            .renderFilter=${this.renderFilter}
            .renderCell=${this.renderCell}
            @page-change=${this.handlePageChange}
            @page-size-change=${this.handlePageSizeChange}
          ></data-table>
        ` : ''}

        ${this.productsState === 'error' ? html`
          <p class="error-message">Error loading products: ${this.error?.message ?? 'Unknown'}</p>
        ` : ''}

        ${this.productsState !== 'loading' && this.displayProducts.length === 0 ? html`
          <p>No products found.</p>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'product-list': ProductList;
  }
}
