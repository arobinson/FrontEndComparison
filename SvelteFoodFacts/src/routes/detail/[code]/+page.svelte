<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import type { MockProductViewModel } from 'shared-types';
  import { productService } from '$lib/services/productService';

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

  let createdDateStr = $derived(product?.createdDate ? toISOString(product.createdDate) : '');
  let lastUpdatedStr = $derived(product?.lastUpdated ? toISOString(product.lastUpdated) : '');
  let releaseDateStr = $derived(product?.releaseDate ? toISOString(product.releaseDate) : '');
  let nextRestockDateStr = $derived(product?.nextRestockDate ? toISOString(product.nextRestockDate) : '');

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
    goto('/list');
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
      const result = await productService.getProduct(code);
      if (result) {
        product = result;
        loadingState = 'loaded';
      } else {
        loadingState = 'error';
        errorMessage = 'Product not found';
      }
    } catch (e) {
      loadingState = 'error';
      errorMessage = e instanceof Error ? e.message : 'Unknown error';
    }
  }
</script>

<div class="product-detail-container">
  <button onclick={navigateToList} class="back-button">← Back to List</button>

  <!-- Svelte uses {#if} blocks instead of Angular's @if or React's ternary/&& -->
  {#if loadingState === 'loaded' && product}
    <div class="product-detail">
      <div class="header-section">
        <h1>{product.productName || 'Unknown Product'}</h1>
        <div class="header-meta">
          <span class="product-code">Code: {product.code}</span>
          {#if product.qualityScore}
            <ProgressBar value={product.qualityScore} />
          {/if}
        </div>
      </div>

      <div class="content-grid">
        <!-- Image Gallery Section -->
        {#if product.imageUrl}
          <div class="image-gallery">
            <h2>Product Images</h2>
            <div class="main-image">
              <ProductImage value={product.imageUrl} size="large" />
            </div>
          </div>
        {/if}

        <!-- Basic Information Section -->
        <div class="info-section">
          <h2>Basic Information</h2>
          <dl class="info-list">
            <dt>Product Name</dt>
            <dd>{product.productName || 'N/A'}</dd>

            <dt>Brand</dt>
            <dd>{product.brand || 'N/A'}</dd>

            <dt>Category</dt>
            <dd>{product.category || 'N/A'}</dd>

            {#if product.description}
              <dt>Description</dt>
              <dd>
                <TruncatedText value={product.description} />
              </dd>
            {/if}

            {#if product.sku}
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            {/if}

            {#if product.modelNumber}
              <dt>Model Number</dt>
              <dd>{product.modelNumber}</dd>
            {/if}

            {#if product.barcode}
              <dt>Barcode</dt>
              <dd>{product.barcode}</dd>
            {/if}

            {#if product.color}
              <dt>Color</dt>
              <dd>
                <ColorPill value={product.color} />
              </dd>
            {/if}

            {#if product.material}
              <dt>Material</dt>
              <dd>{product.material}</dd>
            {/if}

            {#if product.size}
              <dt>Size</dt>
              <dd>{product.size}</dd>
            {/if}

            {#if product.weightKg}
              <dt>Weight</dt>
              <dd>
                <DecimalUnits value={product.weightKg} unit="kg" />
              </dd>
            {/if}

            {#if product.dimensionsCm}
              <dt>Dimensions</dt>
              <dd>{product.dimensionsCm}</dd>
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
        {#if product.grade || product.safetyRating || product.customerRating || product.ecoScore}
          <div class="health-section">
            <h2>Quality & Ratings</h2>
            <div class="score-grid">
              {#if product.grade}
                <div class="score-item">
                  <span class="score-label">Grade</span>
                  <GradeBadge value={product.grade} />
                </div>
              {/if}

              {#if product.safetyRating}
                <div class="score-item">
                  <span class="score-label">Safety Rating</span>
                  <NovaDots value={product.safetyRating} />
                </div>
              {/if}

              {#if product.ecoScore}
                <div class="score-item">
                  <span class="score-label">Eco Score</span>
                  <ProgressBar value={product.ecoScore} />
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Statistics Section -->
        {#if product.unitsSold || product.reviewCount}
          <div class="stats-section">
            <h2>Statistics</h2>
            <dl class="info-list">
              {#if product.unitsSold}
                <dt>Units Sold</dt>
                <dd>
                  <LargeCounter value={product.unitsSold} />
                </dd>
              {/if}

              {#if product.reviewCount}
                <dt>Review Count</dt>
                <dd>
                  <LargeCounter value={product.reviewCount} />
                </dd>
              {/if}

              {#if product.customerRating}
                <dt>Customer Rating</dt>
                <dd>
                  <StarRating value={product.customerRating} />
                </dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Pricing & Financial Section -->
        {#if product.price || product.cost || product.wholesalePrice}
          <div class="pricing-section">
            <h2>Pricing & Financial</h2>
            <dl class="info-list">
              {#if product.price}
                <dt>Price</dt>
                <dd>
                  <DecimalUnits value={product.price} unit={product.currencyCode || ''} />
                </dd>
              {/if}

              {#if product.cost}
                <dt>Cost</dt>
                <dd>
                  <DecimalUnits value={product.cost} unit={product.currencyCode || ''} />
                </dd>
              {/if}

              {#if product.wholesalePrice}
                <dt>Wholesale Price</dt>
                <dd>
                  <DecimalUnits value={product.wholesalePrice} unit={product.currencyCode || ''} />
                </dd>
              {/if}

              {#if product.taxRate !== undefined}
                <dt>Tax Rate</dt>
                <dd>
                  <DecimalUnits value={product.taxRate} unit="%" />
                </dd>
              {/if}

              {#if product.discountPercent !== undefined}
                <dt>Discount</dt>
                <dd>
                  <DecimalUnits value={product.discountPercent} unit="%" />
                </dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Inventory Section -->
        {#if product.stockQuantity !== undefined || product.warehouseLocation || product.reorderLevel !== undefined}
          <div class="inventory-section">
            <h2>Inventory</h2>
            <dl class="info-list">
              {#if product.stockQuantity !== undefined}
                <dt>Stock Quantity</dt>
                <dd>
                  <DecimalUnits value={product.stockQuantity} />
                </dd>
              {/if}

              {#if product.reorderLevel !== undefined}
                <dt>Reorder Level</dt>
                <dd>
                  <DecimalUnits value={product.reorderLevel} />
                </dd>
              {/if}

              {#if product.warehouseLocation}
                <dt>Warehouse Location</dt>
                <dd>{product.warehouseLocation}</dd>
              {/if}

              {#if product.inStock !== undefined}
                <dt>In Stock</dt>
                <dd>
                  <BooleanYesNo value={product.inStock} />
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
        {#if product.originCountry || product.manufacturerCountry || product.shippingZone}
          <div class="geographic-section">
            <h2>Geographic Information</h2>
            <dl class="info-list">
              {#if product.originCountry}
                <dt>Origin Country</dt>
                <dd>{product.originCountry}</dd>
              {/if}

              {#if product.manufacturerCountry}
                <dt>Manufacturer Country</dt>
                <dd>{product.manufacturerCountry}</dd>
              {/if}

              {#if product.shippingZone}
                <dt>Shipping Zone</dt>
                <dd>{product.shippingZone}</dd>
              {/if}

              {#if product.productLanguage}
                <dt>Product Language</dt>
                <dd>{product.productLanguage}</dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Supplier Contact Section -->
        {#if product.firstName || product.lastName || product.supplierEmail || product.supplierPhone}
          <div class="supplier-section">
            <h2>Supplier Contact</h2>
            <dl class="info-list">
              {#if product.firstName || product.lastName}
                <dt>Contact Name</dt>
                <dd>{product.firstName} {product.lastName}</dd>
              {/if}

              {#if product.supplierEmail}
                <dt>Email</dt>
                <dd>
                  <span class="truncate-ellipsis" title={product.supplierEmail}>{product.supplierEmail}</span>
                </dd>
              {/if}

              {#if product.supplierPhone}
                <dt>Phone</dt>
                <dd>{product.supplierPhone}</dd>
              {/if}

              {#if product.supplierTaxId}
                <dt>Tax ID</dt>
                <dd>{product.supplierTaxId}</dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Product Features Section -->
        {#if product.isFeatured || product.isBestSeller || product.requiresShipping || product.isDigital || product.hasWarranty}
          <div class="features-section">
            <h2>Product Features</h2>
            <dl class="info-list">
              {#if product.isFeatured !== undefined}
                <dt>Featured</dt>
                <dd>
                  <BooleanYesNo value={product.isFeatured} />
                </dd>
              {/if}

              {#if product.isBestSeller !== undefined}
                <dt>Best Seller</dt>
                <dd>
                  <BooleanYesNo value={product.isBestSeller} />
                </dd>
              {/if}

              {#if product.requiresShipping !== undefined}
                <dt>Requires Shipping</dt>
                <dd>
                  <BooleanYesNo value={product.requiresShipping} />
                </dd>
              {/if}

              {#if product.isDigital !== undefined}
                <dt>Digital Product</dt>
                <dd>
                  <BooleanYesNo value={product.isDigital} />
                </dd>
              {/if}

              {#if product.hasWarranty !== undefined}
                <dt>Has Warranty</dt>
                <dd>
                  <BooleanYesNo value={product.hasWarranty} />
                </dd>
              {/if}

              {#if product.warrantyMonths !== undefined}
                <dt>Warranty Period</dt>
                <dd>
                  <DecimalUnits value={product.warrantyMonths} unit="months" />
                </dd>
              {/if}

              {#if product.certification}
                <dt>Certification</dt>
                <dd>{product.certification}</dd>
              {/if}
            </dl>
          </div>
        {/if}

        <!-- Shipping Section -->
        {#if product.shippingDepartureTime || product.flightDurationHours !== undefined}
          <div class="shipping-section">
            <h2>Shipping Information</h2>
            <dl class="info-list">
              {#if product.shippingDepartureTime}
                <dt>Departure Time</dt>
                <dd>
                  <TimeFormat value={product.shippingDepartureTime} />
                </dd>
              {/if}

              {#if product.flightDurationHours !== undefined}
                <dt>Flight Duration</dt>
                <dd>
                  <DecimalUnits value={product.flightDurationHours} unit="hours" />
                </dd>
              {/if}
            </dl>
          </div>
        {/if}
      </div>
    </div>
  {:else if loadingState === 'loading'}
    <div class="loading-state">
      <p>Loading product...</p>
    </div>
  {:else if loadingState === 'error'}
    <div class="error-state">
      <p>Error loading product: {errorMessage}</p>
    </div>
  {:else}
    <div class="not-found-state">
      <p>Product not found.</p>
    </div>
  {/if}
</div>

<style>
  .product-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    padding-bottom: 8rem;
    overflow-y: auto;
    height: 100%;
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
