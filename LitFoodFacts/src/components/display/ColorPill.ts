import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('color-pill')
export class ColorPill extends LitElement {
  static styles = css`
    .color-pill {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      border: 1px solid #ddd;
      cursor: help;
    }
  `;

  @property()
  value = '';

  render() {
    return html`
      <span
        class="color-pill"
        style="background-color: ${this.value}"
        title="${this.value}"
      ></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'color-pill': ColorPill;
  }
}
