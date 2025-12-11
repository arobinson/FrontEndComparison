import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ColumnDataType } from 'shared-types';
import '../display/index.js';

@customElement('cell-renderer')
export class CellRenderer extends LitElement {
  @property({ type: Object }) value: unknown = null;
  @property({ type: String }) dataType: ColumnDataType = 'simple-text';
  @property({ type: String }) column = '';
  @property({ type: Object }) row: Record<string, unknown> = {};
  @property({ type: String }) unit?: string;

  // Disable shadow DOM to allow parent styles to cascade
  createRenderRoot() {
    return this;
  }

  render() {
    switch (this.dataType) {
      case 'product-link':
        return html`<product-link .value=${this.value}></product-link>`;
      case 'progress-bar':
        return html`<progress-bar .value=${this.value}></progress-bar>`;
      case 'grade-badge':
        return html`<grade-badge .value=${this.value}></grade-badge>`;
      case 'nova-dots':
        return html`<nova-dots .value=${this.value}></nova-dots>`;
      case 'boolean-yesno':
        return html`<boolean-yesno .value=${this.value}></boolean-yesno>`;
      case 'large-counter':
        return html`<large-counter .value=${this.value}></large-counter>`;
      case 'product-image':
        return html`<product-image .value=${this.value}></product-image>`;
      case 'decimal-units':
        return html`<decimal-units .value=${this.value} .unit=${this.unit}></decimal-units>`;
      case 'color-pill':
        return html`<color-pill .value=${this.value}></color-pill>`;
      case 'relative-date':
        return html`<relative-date .value=${this.value}></relative-date>`;
      case 'time-format':
        return html`<time-format .value=${this.value}></time-format>`;
      case 'absolute-date':
        return html`<absolute-date .value=${this.value}></absolute-date>`;
      case 'truncated-text':
        return html`<truncated-text .value=${this.value}></truncated-text>`;
      case 'star-rating':
        return html`<star-rating .value=${this.value}></star-rating>`;
      default:
        return html`${this.value ?? ''}`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cell-renderer': CellRenderer;
  }
}
