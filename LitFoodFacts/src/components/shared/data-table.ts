import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './lit-button.js';

export type RenderHeaderFn = (column: string) => TemplateResult;
export type RenderFilterFn = (column: string) => TemplateResult | null;
export type RenderCellFn = (value: unknown, column: string, row: Record<string, unknown>) => TemplateResult;

@customElement('data-table')
export class DataTable extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .table-wrapper {
      flex: 1;
      overflow: auto;
      min-height: 0;
    }

    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.875rem;
    }

    .header-cell,
    .filter-cell,
    .data-cell {
      padding: 0.375rem 0.5rem;
      text-align: left;
      vertical-align: middle;
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .header-cell:first-child,
    .filter-cell:first-child,
    .data-cell:first-child {
      border-left: 1px solid #e0e0e0;
    }

    .header-row {
      background: #f5f5f5;
    }

    .header-cell {
      position: sticky;
      top: 0;
      z-index: 12;
      background: #f5f5f5;
      font-weight: 600;
      color: #333;
      min-width: 80px;
      border-top: 1px solid #e0e0e0;
      height: 2.5rem;
      box-sizing: border-box;
      overflow: hidden;
    }

    .filter-row {
      background: #fafafa;
    }

    .filter-cell {
      position: sticky;
      top: 2.5rem;
      z-index: 11;
      background: #fafafa;
      padding: 0.25rem 0.5rem;
      min-width: 80px;
      overflow: visible;
    }

    .data-cell {
      background: #fff;
      overflow: hidden;
    }

    .data-row:hover .data-cell {
      background: #f8f9fa;
    }

    .table-paginator {
      flex-shrink: 0;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-top: 1px solid #e0e0e0;
      z-index: 10;
      margin-top: auto;
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-size-selector label {
      font-size: 14px;
      color: #666;
    }

    .page-size-selector select {
      padding: 4px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #fff;
    }

    .page-size-selector select.error {
      border-color: #dc3545;
      background-color: #fff5f5;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-left: 8px;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-info {
      font-size: 14px;
      color: #666;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #666;
    }

    .empty-text {
      font-size: 16px;
      margin: 0;
    }
  `;

  @property({ type: Array }) columns: string[] = [];
  @property({ type: Array }) value: Record<string, unknown>[] = [];
  @property({ type: Number }) totalPages = 0;
  @property({ type: Number }) page = 0;
  @property({ type: Number }) pageSize = 50;
  @property({ type: Array }) pageSizes: number[] = [10, 25, 50];
  @property({ type: Boolean }) showFilterRow = false;
  @property({ type: String }) emptyText = 'No data available';
  @property({ type: String }) trackBy?: string;
  @property({ attribute: false }) renderHeader?: RenderHeaderFn;
  @property({ attribute: false }) renderFilter?: RenderFilterFn;
  @property({ attribute: false }) renderCell?: RenderCellFn;

  private get hasData(): boolean {
    return this.value && this.value.length > 0;
  }

  private get isValidPageSize(): boolean {
    return this.pageSizes.includes(this.pageSize);
  }

  private getRowTrackValue(row: Record<string, unknown>, index: number): unknown {
    if (this.trackBy && row[this.trackBy] !== undefined) {
      return row[this.trackBy];
    }
    return index;
  }

  private onFirstPage() {
    this.dispatchEvent(new CustomEvent('page-change', { detail: 0 }));
  }

  private onPreviousPage() {
    if (this.page > 0) {
      this.dispatchEvent(new CustomEvent('page-change', { detail: this.page - 1 }));
    }
  }

  private onNextPage() {
    if (this.page < this.totalPages - 1) {
      this.dispatchEvent(new CustomEvent('page-change', { detail: this.page + 1 }));
    }
  }

  private onLastPage() {
    this.dispatchEvent(new CustomEvent('page-change', { detail: this.totalPages - 1 }));
  }

  private handlePageSizeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.dispatchEvent(new CustomEvent('page-size-change', { detail: Number(target.value) }));
  }

  render() {
    if (!this.hasData) {
      return html`
        <div class="empty-state">
          <p class="empty-text">${this.emptyText}</p>
        </div>
      `;
    }

    return html`
      <div class="table-wrapper">
        <table class="data-table">
          <thead class="table-header">
            <tr class="header-row">
              ${this.columns.map(column => html`
                <th class="header-cell" scope="col">
                  ${this.renderHeader ? this.renderHeader(column) : column}
                </th>
              `)}
            </tr>

            ${this.showFilterRow ? html`
              <tr class="filter-row">
                ${this.columns.map(column => html`
                  <th class="filter-cell" scope="col">
                    ${this.renderFilter?.(column)}
                  </th>
                `)}
              </tr>
            ` : ''}
          </thead>

          <tbody class="table-body">
            ${this.value.map((row, index) => html`
              <tr class="data-row" data-key=${this.getRowTrackValue(row, index)}>
                ${this.columns.map(column => html`
                  <td class="data-cell">
                    ${this.renderCell
                      ? this.renderCell(row[column], column, row)
                      : row[column]}
                  </td>
                `)}
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <div class="table-paginator">
        <div class="page-size-selector">
          <label for="pageSize">Items per page:</label>
          <select
            id="pageSize"
            .value=${String(this.pageSize)}
            class=${!this.isValidPageSize ? 'error' : ''}
            @change=${this.handlePageSizeChange}
          >
            ${this.pageSizes.map(size => html`
              <option value=${size} ?selected=${size === this.pageSize}>${size}</option>
            `)}
          </select>
          ${!this.isValidPageSize ? html`
            <span class="error-message">Invalid page size: ${this.pageSize}</span>
          ` : ''}
        </div>

        <div class="pagination-controls">
          <lit-button ?disabled=${this.page === 0} @button-click=${this.onFirstPage} size="sm">
            First
          </lit-button>

          <lit-button ?disabled=${this.page === 0} @button-click=${this.onPreviousPage} size="sm">
            Previous
          </lit-button>

          <span class="page-info">
            Page ${this.page + 1} of ${this.totalPages}
          </span>

          <lit-button ?disabled=${this.page >= this.totalPages - 1} @button-click=${this.onNextPage} size="sm">
            Next
          </lit-button>

          <lit-button ?disabled=${this.page >= this.totalPages - 1} @button-click=${this.onLastPage} size="sm">
            Last
          </lit-button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'data-table': DataTable;
  }
}
