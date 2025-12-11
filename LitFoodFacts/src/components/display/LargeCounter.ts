import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('large-counter')
export class LargeCounter extends LitElement {
  static styles = css`
    .large-counter {
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      color: #333;
    }
  `;

  @property({ type: Number })
  value: number | undefined = undefined;

  private get formattedValue(): string {
    const value = this.value;
    if (value === undefined || value === null) {
      return '0';
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    }
    if (value >= 1_000) {
      return value.toLocaleString('en-US');
    }
    return value.toString();
  }

  render() {
    return html`<span class="large-counter">${this.formattedValue}</span>`;
  }
}
