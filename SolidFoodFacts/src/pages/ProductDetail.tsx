import { createSignal, createEffect, createMemo, Show } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import type { MockProductViewModel } from 'shared-types';
import { productService, type AdjacentProducts } from '../services/productService';

import ProgressBar from '../components/display/ProgressBar';
import ProductImage from '../components/display/ProductImage';
import TruncatedText from '../components/display/TruncatedText';
import GradeBadge from '../components/display/GradeBadge';
import NovaDots from '../components/display/NovaDots';
import LargeCounter from '../components/display/LargeCounter';
import StarRating from '../components/display/StarRating';
import DecimalUnits from '../components/display/DecimalUnits';
import BooleanYesNo from '../components/display/BooleanYesNo';
import ColorPill from '../components/display/ColorPill';
import TimeFormat from '../components/display/TimeFormat';
import AbsoluteDate from '../components/display/AbsoluteDate';
import RelativeDate from '../components/display/RelativeDate';

import './ProductDetail.css';

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

export default function ProductDetail() {
  const params = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = createSignal<MockProductViewModel | null>(null);
  const [loadingState, setLoadingState] = createSignal<'loading' | 'error' | 'loaded'>('loading');
  const [errorMessage, setErrorMessage] = createSignal('');
  const [adjacent, setAdjacent] = createSignal<AdjacentProducts | null>(null);

  // Keep previous product during loading to prevent component destruction
  const [previousProduct, setPreviousProduct] = createSignal<MockProductViewModel | null>(null);
  const displayProduct = createMemo(() => product() ?? previousProduct());

  // Navigation state
  const hasPrevious = createMemo(() => adjacent()?.previousId != null);
  const hasNext = createMemo(() => adjacent()?.nextId != null);
  const positionInfo = createMemo(() => {
    const adj = adjacent();
    return adj ? `${adj.currentIndex} of ${adj.total}` : '';
  });

  const createdDateStr = createMemo(() => displayProduct()?.createdDate ? toISOString(displayProduct()!.createdDate) : '');
  const lastUpdatedStr = createMemo(() => displayProduct()?.lastUpdated ? toISOString(displayProduct()!.lastUpdated) : '');
  const releaseDateStr = createMemo(() => displayProduct()?.releaseDate ? toISOString(displayProduct()!.releaseDate) : '');
  const nextRestockDateStr = createMemo(() => displayProduct()?.nextRestockDate ? toISOString(displayProduct()!.nextRestockDate) : '');

  function navigateToList() {
    navigate('/list');
  }

  function navigateToPrevious() {
    const adj = adjacent();
    if (adj?.previousId) {
      navigate(`/detail/${adj.previousId}`);
    }
  }

  function navigateToNext() {
    const adj = adjacent();
    if (adj?.nextId) {
      navigate(`/detail/${adj.nextId}`);
    }
  }

  async function loadProduct(code: string) {
    setLoadingState('loading');
    try {
      const [productResult, adjacentResult] = await Promise.all([
        productService.getProduct(code),
        productService.getAdjacentProducts(code),
      ]);

      if (productResult) {
        setProduct(productResult);
        setPreviousProduct(productResult);
        setLoadingState('loaded');
      } else {
        setLoadingState('error');
        setErrorMessage('Product not found');
      }
      setAdjacent(adjacentResult);
    } catch (e) {
      setLoadingState('error');
      setErrorMessage(e instanceof Error ? e.message : 'Unknown error');
    }
  }

  createEffect(() => {
    const code = params.code;
    if (code) {
      loadProduct(code);
    }
  });

  return (
    <div class="product-detail-container">
      <div class="navigation-bar">
        <button onClick={navigateToList} class="back-button">← Back to List</button>
        <div class="product-navigation">
          <button onClick={navigateToPrevious} disabled={!hasPrevious()} class="nav-button">
            ← Previous
          </button>
          <span class="position-info">{positionInfo()}</span>
          <button onClick={navigateToNext} disabled={!hasNext()} class="nav-button">
            Next →
          </button>
        </div>
      </div>

      <div class="detail-area">
        <Show when={loadingState() === 'loading'}>
          <div class="loading-overlay">
            <span class="loading-indicator">⏳ Loading...</span>
          </div>
        </Show>

        <Show when={displayProduct()}>
          <div class="product-detail">
            <div class="header-section">
              <h1>{displayProduct()!.productName || 'Unknown Product'}</h1>
              <div class="header-meta">
                <span class="product-code">Code: {displayProduct()!.code}</span>
                <Show when={displayProduct()!.qualityScore}>
                  <ProgressBar value={displayProduct()!.qualityScore!} />
                </Show>
              </div>
            </div>

          <div class="content-grid">
            {/* Image Gallery Section */}
            <Show when={displayProduct()!.imageUrl}>
              <div class="image-gallery">
                <h2>Product Images</h2>
                <div class="main-image">
                  <ProductImage value={displayProduct()!.imageUrl!} size="large" />
                </div>
              </div>
            </Show>

            {/* Basic Information Section */}
            <div class="info-section">
              <h2>Basic Information</h2>
              <dl class="info-list">
                <dt>Product Name</dt>
                <dd>{displayProduct()!.productName || 'N/A'}</dd>

                <dt>Brand</dt>
                <dd>{displayProduct()!.brand || 'N/A'}</dd>

                <dt>Category</dt>
                <dd>{displayProduct()!.category || 'N/A'}</dd>

                <Show when={displayProduct()!.description}>
                  <dt>Description</dt>
                  <dd>
                    <TruncatedText value={displayProduct()!.description!} />
                  </dd>
                </Show>

                <Show when={displayProduct()!.sku}>
                  <dt>SKU</dt>
                  <dd>{displayProduct()!.sku}</dd>
                </Show>

                <Show when={displayProduct()!.modelNumber}>
                  <dt>Model Number</dt>
                  <dd>{displayProduct()!.modelNumber}</dd>
                </Show>

                <Show when={displayProduct()!.barcode}>
                  <dt>Barcode</dt>
                  <dd>{displayProduct()!.barcode}</dd>
                </Show>

                <Show when={displayProduct()!.color}>
                  <dt>Color</dt>
                  <dd>
                    <ColorPill value={displayProduct()!.color!} />
                  </dd>
                </Show>

                <Show when={displayProduct()!.material}>
                  <dt>Material</dt>
                  <dd>{displayProduct()!.material}</dd>
                </Show>

                <Show when={displayProduct()!.size}>
                  <dt>Size</dt>
                  <dd>{displayProduct()!.size}</dd>
                </Show>

                <Show when={displayProduct()!.weightKg}>
                  <dt>Weight</dt>
                  <dd>
                    <DecimalUnits value={displayProduct()!.weightKg!} unit="kg" />
                  </dd>
                </Show>

                <Show when={displayProduct()!.dimensionsCm}>
                  <dt>Dimensions</dt>
                  <dd>{displayProduct()!.dimensionsCm}</dd>
                </Show>

                <dt>Created</dt>
                <dd>
                  <AbsoluteDate value={createdDateStr()} />
                </dd>

                <dt>Last Updated</dt>
                <dd>
                  <RelativeDate value={lastUpdatedStr()} />
                </dd>

                <Show when={releaseDateStr()}>
                  <dt>Release Date</dt>
                  <dd>
                    <AbsoluteDate value={releaseDateStr()} />
                  </dd>
                </Show>
              </dl>
            </div>

            {/* Quality & Ratings Section */}
            <Show when={displayProduct()!.grade || product()!.safetyRating || product()!.customerRating || product()!.ecoScore}>
              <div class="health-section">
                <h2>Quality & Ratings</h2>
                <div class="score-grid">
                  <Show when={displayProduct()!.grade}>
                    <div class="score-item">
                      <span class="score-label">Grade</span>
                      <GradeBadge value={displayProduct()!.grade!} />
                    </div>
                  </Show>

                  <Show when={displayProduct()!.safetyRating}>
                    <div class="score-item">
                      <span class="score-label">Safety Rating</span>
                      <NovaDots value={displayProduct()!.safetyRating!} />
                    </div>
                  </Show>

                  <Show when={displayProduct()!.ecoScore}>
                    <div class="score-item">
                      <span class="score-label">Eco Score</span>
                      <ProgressBar value={displayProduct()!.ecoScore!} />
                    </div>
                  </Show>
                </div>
              </div>
            </Show>

            {/* Statistics Section */}
            <Show when={displayProduct()!.unitsSold || product()!.reviewCount}>
              <div class="stats-section">
                <h2>Statistics</h2>
                <dl class="info-list">
                  <Show when={displayProduct()!.unitsSold}>
                    <dt>Units Sold</dt>
                    <dd>
                      <LargeCounter value={displayProduct()!.unitsSold!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.reviewCount}>
                    <dt>Review Count</dt>
                    <dd>
                      <LargeCounter value={displayProduct()!.reviewCount!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.customerRating}>
                    <dt>Customer Rating</dt>
                    <dd>
                      <StarRating value={displayProduct()!.customerRating!} />
                    </dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Pricing & Financial Section */}
            <Show when={displayProduct()!.price || product()!.cost || product()!.wholesalePrice}>
              <div class="pricing-section">
                <h2>Pricing & Financial</h2>
                <dl class="info-list">
                  <Show when={displayProduct()!.price}>
                    <dt>Price</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.price!} unit={displayProduct()!.currencyCode || ''} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.cost}>
                    <dt>Cost</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.cost!} unit={displayProduct()!.currencyCode || ''} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.wholesalePrice}>
                    <dt>Wholesale Price</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.wholesalePrice!} unit={displayProduct()!.currencyCode || ''} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.taxRate !== undefined}>
                    <dt>Tax Rate</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.taxRate!} unit="%" />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.discountPercent !== undefined}>
                    <dt>Discount</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.discountPercent!} unit="%" />
                    </dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Inventory Section */}
            <Show when={displayProduct()!.stockQuantity !== undefined || product()!.warehouseLocation || product()!.reorderLevel !== undefined}>
              <div class="inventory-section">
                <h2>Inventory</h2>
                <dl class="info-list">
                  <Show when={displayProduct()!.stockQuantity !== undefined}>
                    <dt>Stock Quantity</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.stockQuantity!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.reorderLevel !== undefined}>
                    <dt>Reorder Level</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.reorderLevel!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.warehouseLocation}>
                    <dt>Warehouse Location</dt>
                    <dd>{displayProduct()!.warehouseLocation}</dd>
                  </Show>

                  <Show when={displayProduct()!.inStock !== undefined}>
                    <dt>In Stock</dt>
                    <dd>
                      <BooleanYesNo value={displayProduct()!.inStock!} />
                    </dd>
                  </Show>

                  <Show when={nextRestockDateStr()}>
                    <dt>Next Restock</dt>
                    <dd>
                      <AbsoluteDate value={nextRestockDateStr()} />
                    </dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Geographic Section */}
            <Show when={displayProduct()!.originCountry || product()!.manufacturerCountry || product()!.shippingZone}>
              <div class="geographic-section">
                <h2>Geographic Information</h2>
                <dl class="info-list">
                  <Show when={displayProduct()!.originCountry}>
                    <dt>Origin Country</dt>
                    <dd>{displayProduct()!.originCountry}</dd>
                  </Show>

                  <Show when={displayProduct()!.manufacturerCountry}>
                    <dt>Manufacturer Country</dt>
                    <dd>{displayProduct()!.manufacturerCountry}</dd>
                  </Show>

                  <Show when={displayProduct()!.shippingZone}>
                    <dt>Shipping Zone</dt>
                    <dd>{displayProduct()!.shippingZone}</dd>
                  </Show>

                  <Show when={displayProduct()!.productLanguage}>
                    <dt>Product Language</dt>
                    <dd>{displayProduct()!.productLanguage}</dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Supplier Contact Section */}
            <Show when={displayProduct()!.firstName || product()!.lastName || product()!.supplierEmail || product()!.supplierPhone}>
              <div class="supplier-section">
                <h2>Supplier Contact</h2>
                <dl class="info-list">
                  <Show when={displayProduct()!.firstName || product()!.lastName}>
                    <dt>Contact Name</dt>
                    <dd>{displayProduct()!.firstName} {displayProduct()!.lastName}</dd>
                  </Show>

                  <Show when={displayProduct()!.supplierEmail}>
                    <dt>Email</dt>
                    <dd>
                      <span class="truncate-ellipsis" title={displayProduct()!.supplierEmail}>{displayProduct()!.supplierEmail}</span>
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.supplierPhone}>
                    <dt>Phone</dt>
                    <dd>{displayProduct()!.supplierPhone}</dd>
                  </Show>

                  <Show when={displayProduct()!.supplierTaxId}>
                    <dt>Tax ID</dt>
                    <dd>{displayProduct()!.supplierTaxId}</dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Product Features Section */}
            <Show when={displayProduct()!.isFeatured || product()!.isBestSeller || product()!.requiresShipping || product()!.isDigital || product()!.hasWarranty}>
              <div class="features-section">
                <h2>Product Features</h2>
                <dl class="info-list">
                  <Show when={displayProduct()!.isFeatured !== undefined}>
                    <dt>Featured</dt>
                    <dd>
                      <BooleanYesNo value={displayProduct()!.isFeatured!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.isBestSeller !== undefined}>
                    <dt>Best Seller</dt>
                    <dd>
                      <BooleanYesNo value={displayProduct()!.isBestSeller!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.requiresShipping !== undefined}>
                    <dt>Requires Shipping</dt>
                    <dd>
                      <BooleanYesNo value={displayProduct()!.requiresShipping!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.isDigital !== undefined}>
                    <dt>Digital Product</dt>
                    <dd>
                      <BooleanYesNo value={displayProduct()!.isDigital!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.hasWarranty !== undefined}>
                    <dt>Has Warranty</dt>
                    <dd>
                      <BooleanYesNo value={displayProduct()!.hasWarranty!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.warrantyMonths !== undefined}>
                    <dt>Warranty Period</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.warrantyMonths!} unit="months" />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.certification}>
                    <dt>Certification</dt>
                    <dd>{displayProduct()!.certification}</dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Shipping Section */}
            <Show when={displayProduct()!.shippingDepartureTime || displayProduct()!.flightDurationHours !== undefined}>
              <div class="shipping-section">
                <h2>Shipping Information</h2>
                <dl class="info-list">
                  <Show when={displayProduct()!.shippingDepartureTime}>
                    <dt>Departure Time</dt>
                    <dd>
                      <TimeFormat value={displayProduct()!.shippingDepartureTime!} />
                    </dd>
                  </Show>

                  <Show when={displayProduct()!.flightDurationHours !== undefined}>
                    <dt>Flight Duration</dt>
                    <dd>
                      <DecimalUnits value={displayProduct()!.flightDurationHours!} unit="hours" />
                    </dd>
                  </Show>
                </dl>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      <Show when={loadingState() === 'error'}>
        <div class="error-state">
          <p>Error loading product: {errorMessage()}</p>
        </div>
      </Show>
      </div>
    </div>
  );
}
