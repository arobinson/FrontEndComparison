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

  @property({ type: String })
  value = '';

  @property({ type: String })
  size: 'small' | 'large' = 'small';

  @state()
  private imageLoaded = false;

  @state()
  private imageError = false;

  private handleLoad() {
    this.imageLoaded = true;
  }

  private handleError() {
    this.imageError = true;
  }

  render() {
    return html`
      <div class="product-image ${this.size}">
        ${this.imageError
          ? html`<div class="image-placeholder">No image</div>`
          : html`
              <img
                src="${this.value}"
                alt="Product image"
                class="${this.imageLoaded ? 'loaded' : ''}"
                @load="${this.handleLoad}"
                @error="${this.handleError}"
              />
            `}
      </div>
    `;
  }
}
