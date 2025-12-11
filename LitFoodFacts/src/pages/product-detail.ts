import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { MockProductViewModel } from 'shared-types';
import { productService } from '../services/productService.js';
import '../components/display/index.js';

function toISOString(value: Date | string | number | undefined): string {
  if (!value) return '';
  try {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toISOString();
  } catch {
    return '';
  }
}

@customElement('product-detail')
export class ProductDetail extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      padding-bottom: 8rem;
      overflow-y: auto;
      height: calc(100vh - 40px);
      box-sizing: border-box;
    }

    .back-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-bottom: 2rem;
      transition: background 0.2s;
    }

    .back-button:hover {
      background: #0056b3;
    }

    .product-detail {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      padding-bottom: 8rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e9ecef;
    }

    .header-section h1 {
      margin: 0 0 1rem 0;
      color: #212529;
      font-size: 2rem;
    }

    .header-meta {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .product-code {
      color: #6c757d;
      font-size: 0.95rem;
      font-family: monospace;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .image-gallery {
      grid-column: 1 / -1;
    }

    .image-gallery h2 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1.5rem;
    }

    .main-image {
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1.25rem;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 0.5rem;
    }

    .info-list {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 0.75rem 1rem;
      margin: 0;
    }

    dt {
      font-weight: 600;
      color: #495057;
      align-self: start;
    }

    dd {
      margin: 0;
      color: #212529;
      min-width: 0;
    }

    .truncate-ellipsis {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: help;
    }

    .score-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .score-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .score-label {
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
    }

    .loading-state,
    .error-state,
    .not-found-state {
      padding: 3rem;
      text-align: center;
      color: #6c757d;
    }

    .error-state {
      color: #dc3545;
    }

    .loading-state p {
      font-size: 1.125rem;
    }

    @media (max-width: 768px) {
      product-detail {
        padding: 1rem;
      }

      .product-detail {
        padding: 1rem;
      }

      .header-section h1 {
        font-size: 1.5rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .info-list {
        grid-template-columns: 120px 1fr;
        gap: 0.5rem 0.75rem;
      }
    }
  `;

  @property({ type: String }) code = '';

  @state() private product: MockProductViewModel | null = null;
  @state() private loadingState: 'loading' | 'error' | 'loaded' = 'loading';
  @state() private errorMessage = '';

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('code') && this.code) {
      this.loadProduct();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.code) {
      this.loadProduct();
    }
  }

  private async loadProduct() {
    this.loadingState = 'loading';
    try {
      const result = await productService.getProduct(this.code);
      if (result) {
        this.product = result;
        this.loadingState = 'loaded';
      } else {
        this.loadingState = 'error';
        this.errorMessage = 'Product not found';
      }
    } catch (e) {
      this.loadingState = 'error';
      this.errorMessage = e instanceof Error ? e.message : 'Unknown error';
    }
  }

  private navigateToList() {
    this.dispatchEvent(new CustomEvent('navigate', { detail: '/list' }));
  }

  private get createdDateStr(): string {
    return this.product?.createdDate ? toISOString(this.product.createdDate) : '';
  }

  private get lastUpdatedStr(): string {
    return this.product?.lastUpdated ? toISOString(this.product.lastUpdated) : '';
  }

  private get releaseDateStr(): string {
    return this.product?.releaseDate ? toISOString(this.product.releaseDate) : '';
  }

  private get nextRestockDateStr(): string {
    return this.product?.nextRestockDate ? toISOString(this.product.nextRestockDate) : '';
  }

  render() {
    return html`
      <button @click=${this.navigateToList} class="back-button">← Back to List</button>

      ${this.loadingState === 'loaded' && this.product ? html`
        <div class="product-detail">
          <div class="header-section">
            <h1>${this.product.productName || 'Unknown Product'}</h1>
            <div class="header-meta">
              <span class="product-code">Code: ${this.product.code}</span>
              ${this.product.qualityScore ? html`
                <progress-bar .value=${this.product.qualityScore}></progress-bar>
              ` : ''}
            </div>
          </div>

          <div class="content-grid">
            ${this.product.imageUrl ? html`
              <div class="image-gallery">
                <h2>Product Images</h2>
                <div class="main-image">
                  <product-image .value=${this.product.imageUrl} size="large"></product-image>
                </div>
              </div>
            ` : ''}

            <div class="info-section">
              <h2>Basic Information</h2>
              <dl class="info-list">
                <dt>Product Name</dt>
                <dd>${this.product.productName || 'N/A'}</dd>

                <dt>Brand</dt>
                <dd>${this.product.brand || 'N/A'}</dd>

                <dt>Category</dt>
                <dd>${this.product.category || 'N/A'}</dd>

                ${this.product.description ? html`
                  <dt>Description</dt>
                  <dd><truncated-text .value=${this.product.description}></truncated-text></dd>
                ` : ''}

                ${this.product.sku ? html`
                  <dt>SKU</dt>
                  <dd>${this.product.sku}</dd>
                ` : ''}

                ${this.product.modelNumber ? html`
                  <dt>Model Number</dt>
                  <dd>${this.product.modelNumber}</dd>
                ` : ''}

                ${this.product.barcode ? html`
                  <dt>Barcode</dt>
                  <dd>${this.product.barcode}</dd>
                ` : ''}

                ${this.product.color ? html`
                  <dt>Color</dt>
                  <dd><color-pill .value=${this.product.color}></color-pill></dd>
                ` : ''}

                ${this.product.material ? html`
                  <dt>Material</dt>
                  <dd>${this.product.material}</dd>
                ` : ''}

                ${this.product.size ? html`
                  <dt>Size</dt>
                  <dd>${this.product.size}</dd>
                ` : ''}

                ${this.product.weightKg ? html`
                  <dt>Weight</dt>
                  <dd><decimal-units .value=${this.product.weightKg} unit="kg"></decimal-units></dd>
                ` : ''}

                ${this.product.dimensionsCm ? html`
                  <dt>Dimensions</dt>
                  <dd>${this.product.dimensionsCm}</dd>
                ` : ''}

                <dt>Created</dt>
                <dd><absolute-date .value=${this.createdDateStr}></absolute-date></dd>

                <dt>Last Updated</dt>
                <dd><relative-date .value=${this.lastUpdatedStr}></relative-date></dd>

                ${this.releaseDateStr ? html`
                  <dt>Release Date</dt>
                  <dd><absolute-date .value=${this.releaseDateStr}></absolute-date></dd>
                ` : ''}
              </dl>
            </div>

            ${this.product.grade || this.product.safetyRating || this.product.customerRating || this.product.ecoScore ? html`
              <div class="health-section">
                <h2>Quality & Ratings</h2>
                <div class="score-grid">
                  ${this.product.grade ? html`
                    <div class="score-item">
                      <span class="score-label">Grade</span>
                      <grade-badge .value=${this.product.grade}></grade-badge>
                    </div>
                  ` : ''}

                  ${this.product.safetyRating ? html`
                    <div class="score-item">
                      <span class="score-label">Safety Rating</span>
                      <nova-dots .value=${this.product.safetyRating}></nova-dots>
                    </div>
                  ` : ''}

                  ${this.product.ecoScore ? html`
                    <div class="score-item">
                      <span class="score-label">Eco Score</span>
                      <progress-bar .value=${this.product.ecoScore}></progress-bar>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            ${this.product.unitsSold || this.product.reviewCount ? html`
              <div class="stats-section">
                <h2>Statistics</h2>
                <dl class="info-list">
                  ${this.product.unitsSold ? html`
                    <dt>Units Sold</dt>
                    <dd><large-counter .value=${this.product.unitsSold}></large-counter></dd>
                  ` : ''}

                  ${this.product.reviewCount ? html`
                    <dt>Review Count</dt>
                    <dd><large-counter .value=${this.product.reviewCount}></large-counter></dd>
                  ` : ''}

                  ${this.product.customerRating ? html`
                    <dt>Customer Rating</dt>
                    <dd><star-rating .value=${this.product.customerRating}></star-rating></dd>
                  ` : ''}
                </dl>
              </div>
            ` : ''}

            ${this.product.price || this.product.cost || this.product.wholesalePrice ? html`
              <div class="pricing-section">
                <h2>Pricing & Financial</h2>
                <dl class="info-list">
                  ${this.product.price ? html`
                    <dt>Price</dt>
                    <dd><decimal-units .value=${this.product.price} .unit=${this.product.currencyCode || ''}></decimal-units></dd>
                  ` : ''}

                  ${this.product.cost ? html`
                    <dt>Cost</dt>
                    <dd><decimal-units .value=${this.product.cost} .unit=${this.product.currencyCode || ''}></decimal-units></dd>
                  ` : ''}

                  ${this.product.wholesalePrice ? html`
                    <dt>Wholesale Price</dt>
                    <dd><decimal-units .value=${this.product.wholesalePrice} .unit=${this.product.currencyCode || ''}></decimal-units></dd>
                  ` : ''}

                  ${this.product.taxRate !== undefined ? html`
                    <dt>Tax Rate</dt>
                    <dd><decimal-units .value=${this.product.taxRate} unit="%"></decimal-units></dd>
                  ` : ''}

                  ${this.product.discountPercent !== undefined ? html`
                    <dt>Discount</dt>
                    <dd><decimal-units .value=${this.product.discountPercent} unit="%"></decimal-units></dd>
                  ` : ''}
                </dl>
              </div>
            ` : ''}

            ${this.product.stockQuantity !== undefined || this.product.warehouseLocation || this.product.reorderLevel !== undefined ? html`
              <div class="inventory-section">
                <h2>Inventory</h2>
                <dl class="info-list">
                  ${this.product.stockQuantity !== undefined ? html`
                    <dt>Stock Quantity</dt>
                    <dd><decimal-units .value=${this.product.stockQuantity}></decimal-units></dd>
                  ` : ''}

                  ${this.product.reorderLevel !== undefined ? html`
                    <dt>Reorder Level</dt>
                    <dd><decimal-units .value=${this.product.reorderLevel}></decimal-units></dd>
                  ` : ''}

                  ${this.product.warehouseLocation ? html`
                    <dt>Warehouse Location</dt>
                    <dd>${this.product.warehouseLocation}</dd>
                  ` : ''}

                  ${this.product.inStock !== undefined ? html`
                    <dt>In Stock</dt>
                    <dd><boolean-yesno .value=${this.product.inStock}></boolean-yesno></dd>
                  ` : ''}

                  ${this.nextRestockDateStr ? html`
                    <dt>Next Restock</dt>
                    <dd><absolute-date .value=${this.nextRestockDateStr}></absolute-date></dd>
                  ` : ''}
                </dl>
              </div>
            ` : ''}

            ${this.product.originCountry || this.product.manufacturerCountry || this.product.shippingZone ? html`
              <div class="geographic-section">
                <h2>Geographic Information</h2>
                <dl class="info-list">
                  ${this.product.originCountry ? html`
                    <dt>Origin Country</dt>
                    <dd>${this.product.originCountry}</dd>
                  ` : ''}

                  ${this.product.manufacturerCountry ? html`
                    <dt>Manufacturer Country</dt>
                    <dd>${this.product.manufacturerCountry}</dd>
                  ` : ''}

                  ${this.product.shippingZone ? html`
                    <dt>Shipping Zone</dt>
                    <dd>${this.product.shippingZone}</dd>
                  ` : ''}

                  ${this.product.productLanguage ? html`
                    <dt>Product Language</dt>
                    <dd>${this.product.productLanguage}</dd>
                  ` : ''}
                </dl>
              </div>
            ` : ''}

            ${this.product.firstName || this.product.lastName || this.product.supplierEmail || this.product.supplierPhone ? html`
              <div class="supplier-section">
                <h2>Supplier Contact</h2>
                <dl class="info-list">
                  ${this.product.firstName || this.product.lastName ? html`
                    <dt>Contact Name</dt>
                    <dd>${this.product.firstName} ${this.product.lastName}</dd>
                  ` : ''}

                  ${this.product.supplierEmail ? html`
                    <dt>Email</dt>
                    <dd><span class="truncate-ellipsis" title=${this.product.supplierEmail}>${this.product.supplierEmail}</span></dd>
                  ` : ''}

                  ${this.product.supplierPhone ? html`
                    <dt>Phone</dt>
                    <dd>${this.product.supplierPhone}</dd>
                  ` : ''}

                  ${this.product.supplierTaxId ? html`
                    <dt>Tax ID</dt>
                    <dd>${this.product.supplierTaxId}</dd>
                  ` : ''}
                </dl>
              </div>
            ` : ''}

            ${this.product.isFeatured !== undefined || this.product.isBestSeller !== undefined || this.product.requiresShipping !== undefined || this.product.isDigital !== undefined || this.product.hasWarranty !== undefined ? html`
              <div class="features-section">
                <h2>Product Features</h2>
                <dl class="info-list">
                  ${this.product.isFeatured !== undefined ? html`
                    <dt>Featured</dt>
                    <dd><boolean-yesno .value=${this.product.isFeatured}></boolean-yesno></dd>
                  ` : ''}

                  ${this.product.isBestSeller !== undefined ? html`
                    <dt>Best Seller</dt>
                    <dd><boolean-yesno .value=${this.product.isBestSeller}></boolean-yesno></dd>
                  ` : ''}

                  ${this.product.requiresShipping !== undefined ? html`
                    <dt>Requires Shipping</dt>
                    <dd><boolean-yesno .value=${this.product.requiresShipping}></boolean-yesno></dd>
                  ` : ''}

                  ${this.product.isDigital !== undefined ? html`
                    <dt>Digital Product</dt>
                    <dd><boolean-yesno .value=${this.product.isDigital}></boolean-yesno></dd>
                  ` : ''}

                  ${this.product.hasWarranty !== undefined ? html`
                    <dt>Has Warranty</dt>
                    <dd><boolean-yesno .value=${this.product.hasWarranty}></boolean-yesno></dd>
                  ` : ''}

                  ${this.product.warrantyMonths !== undefined ? html`
                    <dt>Warranty Period</dt>
                    <dd><decimal-units .value=${this.product.warrantyMonths} unit="months"></decimal-units></dd>
                  ` : ''}

                  ${this.product.certification ? html`
                    <dt>Certification</dt>
                    <dd>${this.product.certification}</dd>
                  ` : ''}
                </dl>
              </div>
            ` : ''}

            ${this.product.shippingDepartureTime || this.product.flightDurationHours !== undefined ? html`
              <div class="shipping-section">
                <h2>Shipping Information</h2>
                <dl class="info-list">
                  ${this.product.shippingDepartureTime ? html`
                    <dt>Departure Time</dt>
                    <dd><time-format .value=${this.product.shippingDepartureTime}></time-format></dd>
                  ` : ''}

                  ${this.product.flightDurationHours !== undefined ? html`
                    <dt>Flight Duration</dt>
                    <dd><decimal-units .value=${this.product.flightDurationHours} unit="hours"></decimal-units></dd>
                  ` : ''}
                </dl>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      ${this.loadingState === 'loading' ? html`
        <div class="loading-state">
          <p>⏳ Loading product...</p>
        </div>
      ` : ''}

      ${this.loadingState === 'error' ? html`
        <div class="error-state">
          <p>Error loading product: ${this.errorMessage}</p>
        </div>
      ` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'product-detail': ProductDetail;
  }
}
