import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task, TaskStatus, initialState } from '@lit/task';
import type { MockProductViewModel } from 'shared-types';
import { productService, type AdjacentProducts } from '../services/productService.js';
import '../components/display/index.js';
import '../components/controls/index.js';

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
    }

    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      overflow-y: auto;
      height: calc(100vh - 41px); /* Account for framework header */
      box-sizing: border-box;
    }

    .navigation-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .product-navigation {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .position-info {
      font-size: 0.875rem;
      color: #6c757d;
      min-width: 80px;
      text-align: center;
    }

    .detail-area {
      position: relative;
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
      .product-detail-container {
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

  @property() code = '';

  // One product + one adjacent request per code (initial load and each Previous/Next).
  // The signal is deliberately not passed to fetch (same network trace as before).
  private productTask = new Task(this, {
    task: async ([code]) => {
      if (!code) return initialState;
      const [product, adjacent] = await Promise.all([
        productService.getProduct(code),
        productService.getAdjacentProducts(code),
      ]);
      return { product, adjacent };
    },
    args: () => [this.code] as const,
    onComplete: ({ product, adjacent }) => {
      if (product) this.previousProduct = product;
      this.previousAdjacent = adjacent;
    },
  });

  // Last loaded product / adjacent info. Task.value keeps them while the next code is
  // pending; these also keep them on screen after a failed load, as before.
  private previousProduct: MockProductViewModel | null = null;
  private previousAdjacent: AdjacentProducts | null = null;

  private get displayProduct(): MockProductViewModel | null {
    return this.productTask.value?.product ?? this.previousProduct;
  }

  private get adjacent(): AdjacentProducts | null {
    return this.productTask.value?.adjacent ?? this.previousAdjacent;
  }

  private get loadingState(): 'loading' | 'error' | 'loaded' {
    switch (this.productTask.status) {
      case TaskStatus.COMPLETE:
        return this.productTask.value?.product ? 'loaded' : 'error';
      case TaskStatus.ERROR:
        return 'error';
      default:
        return 'loading';
    }
  }

  private get errorMessage(): string {
    if (this.productTask.status === TaskStatus.ERROR) {
      const e = this.productTask.error;
      return e instanceof Error ? e.message : 'Failed to fetch product';
    }
    return 'Product not found';
  }

  // Navigation state
  private get hasPrevious(): boolean {
    return this.adjacent?.previousId != null;
  }

  private get hasNext(): boolean {
    return this.adjacent?.nextId != null;
  }

  private get positionInfo(): string {
    return this.adjacent ? `${this.adjacent.currentIndex} of ${this.adjacent.total}` : '';
  }

  private navigateToList() {
    this.dispatchEvent(new CustomEvent('navigate', { detail: '/list' }));
  }

  private navigateToPrevious() {
    if (this.adjacent?.previousId) {
      this.dispatchEvent(new CustomEvent('navigate', { detail: `/detail/${this.adjacent.previousId}` }));
    }
  }

  private navigateToNext() {
    if (this.adjacent?.nextId) {
      this.dispatchEvent(new CustomEvent('navigate', { detail: `/detail/${this.adjacent.nextId}` }));
    }
  }

  private get createdDateStr(): string {
    return toISOString(this.displayProduct?.createdDate);
  }

  private get lastUpdatedStr(): string {
    return toISOString(this.displayProduct?.lastUpdated);
  }

  private get releaseDateStr(): string {
    return toISOString(this.displayProduct?.releaseDate);
  }

  private get nextRestockDateStr(): string {
    return toISOString(this.displayProduct?.nextRestockDate);
  }

  render() {
    return html`
      <div class="product-detail-container">
        <div class="navigation-bar">
          <lit-button extra-class="back-button" @button-click=${this.navigateToList}>← Back to List</lit-button>
          <div class="product-navigation">
            <lit-button extra-class="nav-button" ?disabled=${!this.hasPrevious} @button-click=${this.navigateToPrevious}>← Previous</lit-button>
            <span class="position-info">${this.positionInfo}</span>
            <lit-button extra-class="nav-button" ?disabled=${!this.hasNext} @button-click=${this.navigateToNext}>Next →</lit-button>
          </div>
        </div>

        <div class="detail-area">
          ${this.loadingState === 'loading' ? html`
            <div class="loading-overlay">
              <div class="loading-indicator">Loading...</div>
            </div>
          ` : ''}

          ${this.displayProduct ? html`
            <div class="product-detail">
              <div class="header-section">
                <h1>${this.displayProduct.productName || 'Unknown Product'}</h1>
                <div class="header-meta">
                  <span class="product-code">Code: ${this.displayProduct.code}</span>
                  ${this.displayProduct.qualityScore ? html`
                    <progress-bar .value=${this.displayProduct.qualityScore}></progress-bar>
                  ` : ''}
                </div>
              </div>

              <div class="content-grid">
                ${this.displayProduct.imageUrl ? html`
                  <div class="image-gallery">
                    <h2>Product Images</h2>
                    <div class="main-image">
                      <product-image .value=${this.displayProduct.imageUrl} size="large"></product-image>
                    </div>
                  </div>
                ` : ''}

              <div class="info-section">
                <h2>Basic Information</h2>
                <dl class="info-list">
                  <dt>Product Name</dt>
                  <dd>${this.displayProduct.productName || 'N/A'}</dd>

                  <dt>Brand</dt>
                  <dd>${this.displayProduct.brand || 'N/A'}</dd>

                  <dt>Category</dt>
                  <dd>${this.displayProduct.category || 'N/A'}</dd>

                  ${this.displayProduct.description ? html`
                    <dt>Description</dt>
                    <dd><truncated-text .value=${this.displayProduct.description}></truncated-text></dd>
                  ` : ''}

                  ${this.displayProduct.sku ? html`
                    <dt>SKU</dt>
                    <dd>${this.displayProduct.sku}</dd>
                  ` : ''}

                  ${this.displayProduct.modelNumber ? html`
                    <dt>Model Number</dt>
                    <dd>${this.displayProduct.modelNumber}</dd>
                  ` : ''}

                  ${this.displayProduct.barcode ? html`
                    <dt>Barcode</dt>
                    <dd>${this.displayProduct.barcode}</dd>
                  ` : ''}

                  ${this.displayProduct.color ? html`
                    <dt>Color</dt>
                    <dd><color-pill .value=${this.displayProduct.color}></color-pill></dd>
                  ` : ''}

                  ${this.displayProduct.material ? html`
                    <dt>Material</dt>
                    <dd>${this.displayProduct.material}</dd>
                  ` : ''}

                  ${this.displayProduct.size ? html`
                    <dt>Size</dt>
                    <dd>${this.displayProduct.size}</dd>
                  ` : ''}

                  ${this.displayProduct.weightKg ? html`
                    <dt>Weight</dt>
                    <dd><decimal-units .value=${this.displayProduct.weightKg} unit="kg"></decimal-units></dd>
                  ` : ''}

                  ${this.displayProduct.dimensionsCm ? html`
                    <dt>Dimensions</dt>
                    <dd>${this.displayProduct.dimensionsCm}</dd>
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

              ${this.displayProduct.grade || this.displayProduct.safetyRating || this.displayProduct.customerRating || this.displayProduct.ecoScore ? html`
                <div class="health-section">
                  <h2>Quality & Ratings</h2>
                  <div class="score-grid">
                    ${this.displayProduct.grade ? html`
                      <div class="score-item">
                        <span class="score-label">Grade</span>
                        <grade-badge .value=${this.displayProduct.grade}></grade-badge>
                      </div>
                    ` : ''}

                    ${this.displayProduct.safetyRating ? html`
                      <div class="score-item">
                        <span class="score-label">Safety Rating</span>
                        <nova-dots .value=${this.displayProduct.safetyRating}></nova-dots>
                      </div>
                    ` : ''}

                    ${this.displayProduct.ecoScore ? html`
                      <div class="score-item">
                        <span class="score-label">Eco Score</span>
                        <progress-bar .value=${this.displayProduct.ecoScore}></progress-bar>
                      </div>
                    ` : ''}
                  </div>
                </div>
              ` : ''}

              ${this.displayProduct.unitsSold || this.displayProduct.reviewCount ? html`
                <div class="stats-section">
                  <h2>Statistics</h2>
                  <dl class="info-list">
                    ${this.displayProduct.unitsSold ? html`
                      <dt>Units Sold</dt>
                      <dd><large-counter .value=${this.displayProduct.unitsSold}></large-counter></dd>
                    ` : ''}

                    ${this.displayProduct.reviewCount ? html`
                      <dt>Review Count</dt>
                      <dd><large-counter .value=${this.displayProduct.reviewCount}></large-counter></dd>
                    ` : ''}

                    ${this.displayProduct.customerRating ? html`
                      <dt>Customer Rating</dt>
                      <dd><star-rating .value=${this.displayProduct.customerRating}></star-rating></dd>
                    ` : ''}
                  </dl>
                </div>
              ` : ''}

              ${this.displayProduct.price || this.displayProduct.cost || this.displayProduct.wholesalePrice ? html`
                <div class="pricing-section">
                  <h2>Pricing & Financial</h2>
                  <dl class="info-list">
                    ${this.displayProduct.price ? html`
                      <dt>Price</dt>
                      <dd><decimal-units .value=${this.displayProduct.price} .unit=${this.displayProduct.currencyCode || ''}></decimal-units></dd>
                    ` : ''}

                    ${this.displayProduct.cost ? html`
                      <dt>Cost</dt>
                      <dd><decimal-units .value=${this.displayProduct.cost} .unit=${this.displayProduct.currencyCode || ''}></decimal-units></dd>
                    ` : ''}

                    ${this.displayProduct.wholesalePrice ? html`
                      <dt>Wholesale Price</dt>
                      <dd><decimal-units .value=${this.displayProduct.wholesalePrice} .unit=${this.displayProduct.currencyCode || ''}></decimal-units></dd>
                    ` : ''}

                    ${this.displayProduct.taxRate !== undefined ? html`
                      <dt>Tax Rate</dt>
                      <dd><decimal-units .value=${this.displayProduct.taxRate} unit="%"></decimal-units></dd>
                    ` : ''}

                    ${this.displayProduct.discountPercent !== undefined ? html`
                      <dt>Discount</dt>
                      <dd><decimal-units .value=${this.displayProduct.discountPercent} unit="%"></decimal-units></dd>
                    ` : ''}
                  </dl>
                </div>
              ` : ''}

              ${this.displayProduct.stockQuantity !== undefined || this.displayProduct.warehouseLocation || this.displayProduct.reorderLevel !== undefined ? html`
                <div class="inventory-section">
                  <h2>Inventory</h2>
                  <dl class="info-list">
                    ${this.displayProduct.stockQuantity !== undefined ? html`
                      <dt>Stock Quantity</dt>
                      <dd><decimal-units .value=${this.displayProduct.stockQuantity}></decimal-units></dd>
                    ` : ''}

                    ${this.displayProduct.reorderLevel !== undefined ? html`
                      <dt>Reorder Level</dt>
                      <dd><decimal-units .value=${this.displayProduct.reorderLevel}></decimal-units></dd>
                    ` : ''}

                    ${this.displayProduct.warehouseLocation ? html`
                      <dt>Warehouse Location</dt>
                      <dd>${this.displayProduct.warehouseLocation}</dd>
                    ` : ''}

                    ${this.displayProduct.inStock !== undefined ? html`
                      <dt>In Stock</dt>
                      <dd><boolean-yesno .value=${this.displayProduct.inStock}></boolean-yesno></dd>
                    ` : ''}

                    ${this.nextRestockDateStr ? html`
                      <dt>Next Restock</dt>
                      <dd><absolute-date .value=${this.nextRestockDateStr}></absolute-date></dd>
                    ` : ''}
                  </dl>
                </div>
              ` : ''}

              ${this.displayProduct.originCountry || this.displayProduct.manufacturerCountry || this.displayProduct.shippingZone ? html`
                <div class="geographic-section">
                  <h2>Geographic Information</h2>
                  <dl class="info-list">
                    ${this.displayProduct.originCountry ? html`
                      <dt>Origin Country</dt>
                      <dd>${this.displayProduct.originCountry}</dd>
                    ` : ''}

                    ${this.displayProduct.manufacturerCountry ? html`
                      <dt>Manufacturer Country</dt>
                      <dd>${this.displayProduct.manufacturerCountry}</dd>
                    ` : ''}

                    ${this.displayProduct.shippingZone ? html`
                      <dt>Shipping Zone</dt>
                      <dd>${this.displayProduct.shippingZone}</dd>
                    ` : ''}

                    ${this.displayProduct.productLanguage ? html`
                      <dt>Product Language</dt>
                      <dd>${this.displayProduct.productLanguage}</dd>
                    ` : ''}
                  </dl>
                </div>
              ` : ''}

              ${this.displayProduct.firstName || this.displayProduct.lastName || this.displayProduct.supplierEmail || this.displayProduct.supplierPhone ? html`
                <div class="supplier-section">
                  <h2>Supplier Contact</h2>
                  <dl class="info-list">
                    ${this.displayProduct.firstName || this.displayProduct.lastName ? html`
                      <dt>Contact Name</dt>
                      <dd>${this.displayProduct.firstName} ${this.displayProduct.lastName}</dd>
                    ` : ''}

                    ${this.displayProduct.supplierEmail ? html`
                      <dt>Email</dt>
                      <dd><span class="truncate-ellipsis" title=${this.displayProduct.supplierEmail}>${this.displayProduct.supplierEmail}</span></dd>
                    ` : ''}

                    ${this.displayProduct.supplierPhone ? html`
                      <dt>Phone</dt>
                      <dd>${this.displayProduct.supplierPhone}</dd>
                    ` : ''}

                    ${this.displayProduct.supplierTaxId ? html`
                      <dt>Tax ID</dt>
                      <dd>${this.displayProduct.supplierTaxId}</dd>
                    ` : ''}
                  </dl>
                </div>
              ` : ''}

              ${this.displayProduct.isFeatured || this.displayProduct.isBestSeller || this.displayProduct.requiresShipping || this.displayProduct.isDigital || this.displayProduct.hasWarranty ? html`
                <div class="features-section">
                  <h2>Product Features</h2>
                  <dl class="info-list">
                    ${this.displayProduct.isFeatured !== undefined ? html`
                      <dt>Featured</dt>
                      <dd><boolean-yesno .value=${this.displayProduct.isFeatured}></boolean-yesno></dd>
                    ` : ''}

                    ${this.displayProduct.isBestSeller !== undefined ? html`
                      <dt>Best Seller</dt>
                      <dd><boolean-yesno .value=${this.displayProduct.isBestSeller}></boolean-yesno></dd>
                    ` : ''}

                    ${this.displayProduct.requiresShipping !== undefined ? html`
                      <dt>Requires Shipping</dt>
                      <dd><boolean-yesno .value=${this.displayProduct.requiresShipping}></boolean-yesno></dd>
                    ` : ''}

                    ${this.displayProduct.isDigital !== undefined ? html`
                      <dt>Digital Product</dt>
                      <dd><boolean-yesno .value=${this.displayProduct.isDigital}></boolean-yesno></dd>
                    ` : ''}

                    ${this.displayProduct.hasWarranty !== undefined ? html`
                      <dt>Has Warranty</dt>
                      <dd><boolean-yesno .value=${this.displayProduct.hasWarranty}></boolean-yesno></dd>
                    ` : ''}

                    ${this.displayProduct.warrantyMonths !== undefined ? html`
                      <dt>Warranty Period</dt>
                      <dd><decimal-units .value=${this.displayProduct.warrantyMonths} unit="months"></decimal-units></dd>
                    ` : ''}

                    ${this.displayProduct.certification ? html`
                      <dt>Certification</dt>
                      <dd>${this.displayProduct.certification}</dd>
                    ` : ''}
                  </dl>
                </div>
              ` : ''}

              ${this.displayProduct.shippingDepartureTime || this.displayProduct.flightDurationHours !== undefined ? html`
                <div class="shipping-section">
                  <h2>Shipping Information</h2>
                  <dl class="info-list">
                    ${this.displayProduct.shippingDepartureTime ? html`
                      <dt>Departure Time</dt>
                      <dd><time-format .value=${this.displayProduct.shippingDepartureTime}></time-format></dd>
                    ` : ''}

                    ${this.displayProduct.flightDurationHours !== undefined ? html`
                      <dt>Flight Duration</dt>
                      <dd><decimal-units .value=${this.displayProduct.flightDurationHours} unit="hours"></decimal-units></dd>
                    ` : ''}
                  </dl>
                </div>
              ` : ''}
            </div>
          </div>
        ` : this.loadingState === 'loading' ? html`
          <div class="loading-state">
            <p>Loading product...</p>
          </div>
        ` : this.loadingState === 'error' ? html`
          <div class="error-state">
            <p>Error loading product: ${this.errorMessage}</p>
          </div>
        ` : html`
          <div class="not-found-state">
            <p>Product not found.</p>
          </div>
        `}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'product-detail': ProductDetail;
  }
}
