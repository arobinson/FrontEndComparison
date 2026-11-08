import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('product-image')
export class ProductImage extends LitElement {
  static styles = css`
    .product-image {
      display: inline-block;
    }

    .product-image img {
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-image img.loaded {
      opacity: 1;
    }

    .product-image.small img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }

    .product-image.large img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }

    .image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      color: #999;
      font-size: 12px;
    }

    .small .image-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }

    .large .image-placeholder {
      width: 200px;
      height: 200px;
      border-radius: 8px;
    }
  `;

  @property()
  value = '';

  @property()
  size: 'small' | 'large' = 'small';

  // Load/error state belongs to the URL it happened for, so a new URL starts out not loaded
  @state() private loadedSrc: string | null = null;
  @state() private failedSrc: string | null = null;

  private handleLoad() {
    this.loadedSrc = this.value;
  }

  private handleError() {
    this.failedSrc = this.value;
  }

  render() {
    return html`
      <div class="product-image ${this.size}">
        ${this.failedSrc === this.value
          ? html`<div class="image-placeholder">No image</div>`
          : html`
              <img
                src="${this.value}"
                alt="Product image"
                class="${this.loadedSrc === this.value ? 'loaded' : ''}"
                @load="${this.handleLoad}"
                @error="${this.handleError}"
              />
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'product-image': ProductImage;
  }
}
