<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import type { MockProductViewModel } from 'shared-types';
  import { productService, type AdjacentProducts } from '$lib/services/productService';

  import ProgressBar from '$lib/components/display/ProgressBar.svelte';
  import ProductImage from '$lib/components/display/ProductImage.svelte';
  import TruncatedText from '$lib/components/display/TruncatedText.svelte';
  import GradeBadge from '$lib/components/display/GradeBadge.svelte';
  import NovaDots from '$lib/components/display/NovaDots.svelte';
  import LargeCounter from '$lib/components/display/LargeCounter.svelte';
  import StarRating from '$lib/components/display/StarRating.svelte';
  import DecimalUnits from '$lib/components/display/DecimalUnits.svelte';
  import BooleanYesNo from '$lib/components/display/BooleanYesNo.svelte';
  import ColorPill from '$lib/components/display/ColorPill.svelte';
  import TimeFormat from '$lib/components/display/TimeFormat.svelte';
  import AbsoluteDate from '$lib/components/display/AbsoluteDate.svelte';
  import RelativeDate from '$lib/components/display/RelativeDate.svelte';

  let product = $state<MockProductViewModel | null>(null);
  let loadingState = $state<'loading' | 'error' | 'loaded'>('loading');
  let errorMessage = $state<string>('');
  let adjacent = $state<AdjacentProducts | null>(null);

  // Keep previous product during loading to prevent component destruction
  let previousProduct = $state<MockProductViewModel | null>(null);
  let displayProduct = $derived(product ?? previousProduct);

  // Navigation state
  let hasPrevious = $derived(adjacent?.previousId != null);
  let hasNext = $derived(adjacent?.nextId != null);
  let positionInfo = $derived(adjacent ? `${adjacent.currentIndex} of ${adjacent.total}` : '');

  let createdDateStr = $derived(displayProduct?.createdDate ? toISOString(displayProduct.createdDate) : '');
  let lastUpdatedStr = $derived(displayProduct?.lastUpdated ? toISOString(displayProduct.lastUpdated) : '');
  let releaseDateStr = $derived(displayProduct?.releaseDate ? toISOString(displayProduct.releaseDate) : '');
  let nextRestockDateStr = $derived(displayProduct?.nextRestockDate ? toISOString(displayProduct.nextRestockDate) : '');

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

  function navigateToList() {
    goto(resolve('/list'));
  }

  function navigateToPrevious() {
    if (adjacent?.previousId) {
      goto(resolve(`/detail/${adjacent.previousId}`));
    }
  }

  function navigateToNext() {
    if (adjacent?.nextId) {
      goto(resolve(`/detail/${adjacent.nextId}`));
    }
  }

  $effect(() => {
    const code = page.params.code;

    if (code) {
      loadProduct(code);
    }
  });

  async function loadProduct(code: string) {
    loadingState = 'loading';
    try {
      const [productResult, adjacentResult] = await Promise.all([
        productService.getProduct(code),
        productService.getAdjacentProducts(code),
      ]);

      if (productResult) {
        product = productResult;
        previousProduct = productResult;
        loadingState = 'loaded';
      } else {
        loadingState = 'error';
        errorMessage = 'Product not found';
      }
      adjacent = adjacentResult;
    } catch (e) {
      loadingState = 'error';
      errorMessage = e instanceof Error ? e.message : 'Unknown error';
    }
  }
</script>

<div class="product-detail-container">
  <div class="navigation-bar">
    <button onclick={navigateToList} class="back-button">← Back to List</button>
    <div class="product-navigation">
      <button onclick={navigateToPrevious} disabled={!hasPrevious} class="nav-button">
        ← Previous
      </button>
      <span class="position-info">{positionInfo}</span>
      <button onclick={navigateToNext} disabled={!hasNext} class="nav-button">
        Next →
      </button>
    </div>
  </div>

  <div class="detail-area">
    {#if loadingState === 'loading'}
      <div class="loading-overlay">
        <span class="loading-indicator">⏳ Loading...</span>
      </div>
    {/if}

    {#if displayProduct}
    <div class="product-detail">
      <div class="header-section">
        <h1>{displayProduct.productName || 'Unknown Product'}</h1>
        <div class="header-meta">
          <span class="product-code">Code: {displayProduct.code}</span>
          {#if displayProduct.qualityScore}
            <ProgressBar value={displayProduct.qualityScore} />
          {/if}
        </div>
      </div>

      <div class="content-grid">
        <!-- Image Gallery Section -->
        {#if displayProduct.imageUrl}
          <div class="image-gallery">
            <h2>Product Images</h2>
            <div class="main-image">
              <ProductImage value={displayProduct.imageUrl} size="large" />
            </div>
          </div>
        {/if}

        <!-- Basic Information Section -->
        <div class="info-section">
          <h2>Basic Information</h2>
          <dl class="info-list">
            <dt>Product Name</dt>
            <dd>{displayProduct.productName || 'N/A'}</dd>

            <dt>Brand</dt>
            <dd>{displayProduct.brand || 'N/A'}</dd>

            <dt>Category</dt>
            <dd>{displayProduct.category || 'N/A'}</dd>

            {#if displayProduct.description}
              <dt>Description</dt>
              <dd>
                <TruncatedText value={displayProduct.description} />
              </dd>
            {/if}

            {#if displayProduct.sku}
              <dt>SKU</dt>
              <dd>{displayProduct.sku}</dd>
            {/if}

            {#if displayProduct.modelNumber}
              <dt>Model Number</dt>
              <dd>{displayProduct.modelNumber}</dd>
            {/if}

            {#if displayProduct.barcode}
              <dt>Barcode</dt>
              <dd>{displayProduct.barcode}</dd>
            {/if}

            {#if displayProduct.color}
              <dt>Color</dt>
              <dd>
                <ColorPill value={displayProduct.color} />
              </dd>
            {/if}

            {#if displayProduct.material}
              <dt>Material</dt>
              <dd>{displayProduct.material}</dd>
            {/if}

            {#if displayProduct.size}
              <dt>Size</dt>
              <dd>{displayProduct.size}</dd>
            {/if}

            {#if displayProduct.weightKg}
              <dt>Weight</dt>
              <dd>
                <DecimalUnits value={displayProduct.weightKg} unit="kg" />
              </dd>
            {/if}

            {#if displayProduct.dimensionsCm}
              <dt>Dimensions</dt>
              <dd>{displayProduct.dimensionsCm}</dd>
            {/if}

            <dt>Created</dt>
            <dd>
              <AbsoluteDate value={createdDateStr} />
            </dd>

            <dt>Last Updated</dt>
            <dd>
              <RelativeDate value={lastUpdatedStr} />
            </dd>

            {#if releaseDateStr}
              <dt>Release Date</dt>
              <dd>
                <AbsoluteDate value={releaseDateStr} />
              </dd>
            {/if}
          </dl>
        </div>

        <!-- Quality & Ratings Section -->
        {#if displayProduct.grade || product.safetyRating || product.customerRating || product.ecoScore}
          <div class="health-section">
            <h2>Quality & Ratings</h2>
            <div class="score-grid">
              {#if displayProduct.grade}
                <div class="score-item">
                  <span class="score-label">Grade</span>
                  <GradeBadge value={displayProduct.grade} />
                </div>
              {/if}

              {#if displayProduct.safetyRating}
                <div class="score-item">
                  <span class="score-label">Safety Rating</span>
                  <NovaDots value={displayProduct.safetyRating} />
                </div>
              {/if}

              {#if displayProduct.ecoScore}
                <div class="score-item">
                  <span class="score-label">Eco Score</span>
                  <ProgressBar value={displayProduct.ecoScore} />
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Statistics Section -->
        {#if displayProduct.unitsSold || product.reviewCount}
          <div class="stats-section">
            <h2>Statistics</h2>
            <dl class="info-list">
              {#if displayProduct.unitsSold}
                <dt>Units Sold</dt>
                <dd>
                  <LargeCounter value={displayProduct.unitsSold} />
                </dd>
              {/if}

              {#if displayProduct.reviewCount}
                <dt>Review Count</dt>
                <dd>
                  <LargeCounter value={displayProduct.reviewCount} />
                </dd>
              {/if}

              {#if displayProduct.customerRating}
                <dt>Customer Rating</dt>
                <dd>
                  <StarRating value={displayProduct.customerRating} />
                </dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Pricing & Financial Section -->
        {#if displayProduct.price || product.cost || product.wholesalePrice}
          <div class="pricing-section">
            <h2>Pricing & Financial</h2>
            <dl class="info-list">
              {#if displayProduct.price}
                <dt>Price</dt>
                <dd>
                  <DecimalUnits value={displayProduct.price} unit={displayProduct.currencyCode || ''} />
                </dd>
              {/if}

              {#if displayProduct.cost}
                <dt>Cost</dt>
                <dd>
                  <DecimalUnits value={displayProduct.cost} unit={displayProduct.currencyCode || ''} />
                </dd>
              {/if}

              {#if displayProduct.wholesalePrice}
                <dt>Wholesale Price</dt>
                <dd>
                  <DecimalUnits value={displayProduct.wholesalePrice} unit={displayProduct.currencyCode || ''} />
                </dd>
              {/if}

              {#if displayProduct.taxRate !== undefined}
                <dt>Tax Rate</dt>
                <dd>
                  <DecimalUnits value={displayProduct.taxRate} unit="%" />
                </dd>
              {/if}

              {#if displayProduct.discountPercent !== undefined}
                <dt>Discount</dt>
                <dd>
                  <DecimalUnits value={displayProduct.discountPercent} unit="%" />
                </dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Inventory Section -->
        {#if displayProduct.stockQuantity !== undefined || product.warehouseLocation || product.reorderLevel !== undefined}
          <div class="inventory-section">
            <h2>Inventory</h2>
            <dl class="info-list">
              {#if displayProduct.stockQuantity !== undefined}
                <dt>Stock Quantity</dt>
                <dd>
                  <DecimalUnits value={displayProduct.stockQuantity} />
                </dd>
              {/if}

              {#if displayProduct.reorderLevel !== undefined}
                <dt>Reorder Level</dt>
                <dd>
                  <DecimalUnits value={displayProduct.reorderLevel} />
                </dd>
              {/if}

              {#if displayProduct.warehouseLocation}
                <dt>Warehouse Location</dt>
                <dd>{displayProduct.warehouseLocation}</dd>
              {/if}

              {#if displayProduct.inStock !== undefined}
                <dt>In Stock</dt>
                <dd>
                  <BooleanYesNo value={displayProduct.inStock} />
                </dd>
              {/if}

              {#if nextRestockDateStr}
                <dt>Next Restock</dt>
                <dd>
                  <AbsoluteDate value={nextRestockDateStr} />
                </dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Geographic Section -->
        {#if displayProduct.originCountry || product.manufacturerCountry || product.shippingZone}
          <div class="geographic-section">
            <h2>Geographic Information</h2>
            <dl class="info-list">
              {#if displayProduct.originCountry}
                <dt>Origin Country</dt>
                <dd>{displayProduct.originCountry}</dd>
              {/if}

              {#if displayProduct.manufacturerCountry}
                <dt>Manufacturer Country</dt>
                <dd>{displayProduct.manufacturerCountry}</dd>
              {/if}

              {#if displayProduct.shippingZone}
                <dt>Shipping Zone</dt>
                <dd>{displayProduct.shippingZone}</dd>
              {/if}

              {#if displayProduct.productLanguage}
                <dt>Product Language</dt>
                <dd>{displayProduct.productLanguage}</dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Supplier Contact Section -->
        {#if displayProduct.firstName || product.lastName || product.supplierEmail || product.supplierPhone}
          <div class="supplier-section">
            <h2>Supplier Contact</h2>
            <dl class="info-list">
              {#if displayProduct.firstName || product.lastName}
                <dt>Contact Name</dt>
                <dd>{displayProduct.firstName} {displayProduct.lastName}</dd>
              {/if}

              {#if displayProduct.supplierEmail}
                <dt>Email</dt>
                <dd>
                  <span class="truncate-ellipsis" title={displayProduct.supplierEmail}>{displayProduct.supplierEmail}</span>
                </dd>
              {/if}

              {#if displayProduct.supplierPhone}
                <dt>Phone</dt>
                <dd>{displayProduct.supplierPhone}</dd>
              {/if}

              {#if displayProduct.supplierTaxId}
                <dt>Tax ID</dt>
                <dd>{displayProduct.supplierTaxId}</dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Product Features Section -->
        {#if displayProduct.isFeatured || product.isBestSeller || product.requiresShipping || product.isDigital || product.hasWarranty}
          <div class="features-section">
            <h2>Product Features</h2>
            <dl class="info-list">
              {#if displayProduct.isFeatured !== undefined}
                <dt>Featured</dt>
                <dd>
                  <BooleanYesNo value={displayProduct.isFeatured} />
                </dd>
              {/if}

              {#if displayProduct.isBestSeller !== undefined}
                <dt>Best Seller</dt>
                <dd>
                  <BooleanYesNo value={displayProduct.isBestSeller} />
                </dd>
              {/if}

              {#if displayProduct.requiresShipping !== undefined}
                <dt>Requires Shipping</dt>
                <dd>
                  <BooleanYesNo value={displayProduct.requiresShipping} />
                </dd>
              {/if}

              {#if displayProduct.isDigital !== undefined}
                <dt>Digital Product</dt>
                <dd>
                  <BooleanYesNo value={displayProduct.isDigital} />
                </dd>
              {/if}

              {#if displayProduct.hasWarranty !== undefined}
                <dt>Has Warranty</dt>
                <dd>
                  <BooleanYesNo value={displayProduct.hasWarranty} />
                </dd>
              {/if}

              {#if displayProduct.warrantyMonths !== undefined}
                <dt>Warranty Period</dt>
                <dd>
                  <DecimalUnits value={displayProduct.warrantyMonths} unit="months" />
                </dd>
              {/if}

              {#if displayProduct.certification}
                <dt>Certification</dt>
                <dd>{displayProduct.certification}</dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Shipping Section -->
        {#if displayProduct.shippingDepartureTime || displayProduct.flightDurationHours !== undefined}
          <div class="shipping-section">
            <h2>Shipping Information</h2>
            <dl class="info-list">
              {#if displayProduct.shippingDepartureTime}
                <dt>Departure Time</dt>
                <dd>
                  <TimeFormat value={displayProduct.shippingDepartureTime} />
                </dd>
              {/if}

              {#if displayProduct.flightDurationHours !== undefined}
                <dt>Flight Duration</dt>
                <dd>
                  <DecimalUnits value={displayProduct.flightDurationHours} unit="hours" />
                </dd>
              {/if}
            </dl>
          </div>
        {/if}
      </div>
    </div>
    {:else if loadingState === 'error'}
      <div class="error-state">
        <p>Error loading product: {errorMessage}</p>
      </div>
    {:else if loadingState !== 'loading'}
      <div class="not-found-state">
        <p>Product not found.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .product-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    overflow-y: auto;
    height: calc(100vh - 41px); /* Account for framework header */
  }

  .navigation-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .back-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .back-button:hover {
    background: #0056b3;
  }

  .product-navigation {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .nav-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
  }

  .nav-button:hover:not(:disabled) {
    background: #0056b3;
  }

  .nav-button:disabled {
    background: #cccccc;
    cursor: not-allowed;
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

  /* Header Section */
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

  /* Content Grid */
  .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  /* Image Gallery */
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

  /* Section Headings */
  h2 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1.25rem;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 0.5rem;
  }

  /* Info Lists */
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

  /* Truncate with ellipsis */
  .truncate-ellipsis {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: help;
  }

  /* Score Grid */
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

  /* Loading/Error States */
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

  /* Responsive Design */
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
</style>
