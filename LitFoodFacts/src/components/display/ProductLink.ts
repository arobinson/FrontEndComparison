import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

@customElement('product-link')
export class ProductLink extends LitElement {
  static styles = css`
    .product-link {
      color: var(--color-primary, #0066cc);
      text-decoration: none;
      font-weight: 500;
    }

    .product-link:hover {
      color: var(--color-primary-dark, #004499);
    }

    .product-link:visited {
      color: var(--color-primary-visited, #551a8b);
    }
  `;

  @property()
  value: string | number = '';

  // Client-side navigation for a plain click; a modified click (new tab/window) keeps the
  // browser's default, as a router link does.
  private handleClick(e: MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('navigate-to-detail', {
      detail: this.value,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`<a class="product-link" href="${BASE_URL}/detail/${this.value}" @click="${this.handleClick}">${this.value}</a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'product-link': ProductLink;
  }
}
