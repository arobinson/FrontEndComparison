import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

@customElement('product-link')
export class ProductLink extends LitElement {
  static styles = css`
    a {
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      color: #004499;
    }
    a:visited {
      color: #551a8b;
    }
  `;

  @property({ type: String })
  value: string | number = '';

  private handleClick(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('navigate-to-detail', {
      detail: this.value,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <a href="${BASE_URL}/detail/${this.value}" @click="${this.handleClick}">
        ${this.value}
      </a>
    `;
  }
}
