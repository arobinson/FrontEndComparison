import { createMemo, Show, Suspense } from 'solid-js';
import { createAsync, useIsRouting, useParams, useNavigate } from '@solidjs/router';
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

import Button from '../components/shared/Button';

import './ProductDetail.css';

interface DetailData {
  product: MockProductViewModel | null;
  /** undefined when the request failed (keep the previous adjacent info) */
  adjacent?: AdjacentProducts | null;
  error?: string;
}

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
  const isRouting = useIsRouting();

  // Product + adjacent are requested together (product first), once per code, like before.
  // Previous/Next are router navigations, which run in a transition: because the data is read
  // inside the <Suspense> below, the transition holds and the current product stays on screen
  // (with the overlay, via isRouting) until both responses have arrived.
  // Failures are returned as values so the navigation bar (outside the detail area) never throws.
  const data = createAsync(async (): Promise<DetailData> => {
    const code = params.code!; // always set: the route is /detail/:code
    try {
      const [product, adjacent] = await Promise.all([
        productService.getProduct(code),
        productService.getAdjacentProducts(code),
      ]);
      return product ? { product, adjacent } : { product: null, adjacent, error: 'Product not found' };
    } catch (e) {
      return { product: null, error: e instanceof Error ? e.message : 'Failed to fetch product' };
    }
  });

  // The product and adjacent info are only replaced by a successful response (adjacent also on
  // "not found"), so a failed load keeps showing the previous product.
  const product = createMemo<MockProductViewModel | null>((prev) => data()?.product ?? prev, null);
  const adjacent = createMemo<AdjacentProducts | null>((prev) => {
    const result = data();
    return result && result.adjacent !== undefined ? result.adjacent : prev;
  }, null);
  const errorMessage = () => data()?.error;

  // Navigation state
  const hasPrevious = createMemo(() => adjacent()?.previousId != null);
  const hasNext = createMemo(() => adjacent()?.nextId != null);
  const positionInfo = createMemo(() => {
    const adj = adjacent();
    return adj ? `${adj.currentIndex} of ${adj.total}` : '';
  });

  const createdDateStr = createMemo(() => product()?.createdDate ? toISOString(product()!.createdDate) : '');
  const lastUpdatedStr = createMemo(() => product()?.lastUpdated ? toISOString(product()!.lastUpdated) : '');
  const releaseDateStr = createMemo(() => product()?.releaseDate ? toISOString(product()!.releaseDate) : '');
  const nextRestockDateStr = createMemo(() => product()?.nextRestockDate ? toISOString(product()!.nextRestockDate) : '');

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

  return (
    <div class="product-detail-container">
      <div class="navigation-bar">
        <Button class="back-button" onClick={navigateToList}>
          ← Back to List
        </Button>
        <div class="product-navigation">
          <Button class="nav-button" disabled={!hasPrevious()} onClick={navigateToPrevious}>
            ← Previous
          </Button>
          <span class="position-info">{positionInfo()}</span>
          <Button class="nav-button" disabled={!hasNext()} onClick={navigateToNext}>
            Next →
          </Button>
        </div>
      </div>

      <div class="detail-area">
        {/* Previous/Next in progress: the current product stays mounted (transition) under this overlay */}
        <Show when={isRouting()}>
          <div class="loading-overlay">
            <span class="loading-indicator">⏳ Loading...</span>
          </div>
        </Show>

        {/* First load: nothing to show yet */}
        <Suspense
          fallback={
            <>
              <div class="loading-overlay">
                <span class="loading-indicator">⏳ Loading...</span>
              </div>
              <div class="loading-state">
                <p>Loading product...</p>
              </div>
            </>
          }
        >
        {/* Reading data() here, inside <Suspense>, is what lets the navigation transition hold */}
        <Show when={data()}>
        <Show
          when={product()}
          fallback={
            <Show
              when={errorMessage()}
              fallback={
                <div class="not-found-state">
                  <p>Product not found.</p>
                </div>
              }
            >
              <div class="error-state">
                <p>Error loading product: {errorMessage()}</p>
              </div>
            </Show>
          }
        >
          <div class="product-detail">
            <div class="header-section">
              <h1>{product()!.productName || 'Unknown Product'}</h1>
              <div class="header-meta">
                <span class="product-code">Code: {product()!.code}</span>
                <Show when={product()!.qualityScore}>
                  <ProgressBar value={product()!.qualityScore!} />
                </Show>
              </div>
            </div>

          <div class="content-grid">
            {/* Image Gallery Section */}
            <Show when={product()!.imageUrl}>
              <div class="image-gallery">
                <h2>Product Images</h2>
                <div class="main-image">
                  <ProductImage value={product()!.imageUrl!} size="large" />
                </div>
              </div>
            </Show>

            {/* Basic Information Section */}
            <div class="info-section">
              <h2>Basic Information</h2>
              <dl class="info-list">
                <dt>Product Name</dt>
                <dd>{product()!.productName || 'N/A'}</dd>

                <dt>Brand</dt>
                <dd>{product()!.brand || 'N/A'}</dd>

                <dt>Category</dt>
                <dd>{product()!.category || 'N/A'}</dd>

                <Show when={product()!.description}>
                  <dt>Description</dt>
                  <dd>
                    <TruncatedText value={product()!.description!} />
                  </dd>
                </Show>

                <Show when={product()!.sku}>
                  <dt>SKU</dt>
                  <dd>{product()!.sku}</dd>
                </Show>

                <Show when={product()!.modelNumber}>
                  <dt>Model Number</dt>
                  <dd>{product()!.modelNumber}</dd>
                </Show>

                <Show when={product()!.barcode}>
                  <dt>Barcode</dt>
                  <dd>{product()!.barcode}</dd>
                </Show>

                <Show when={product()!.color}>
                  <dt>Color</dt>
                  <dd>
                    <ColorPill value={product()!.color!} />
                  </dd>
                </Show>

                <Show when={product()!.material}>
                  <dt>Material</dt>
                  <dd>{product()!.material}</dd>
                </Show>

                <Show when={product()!.size}>
                  <dt>Size</dt>
                  <dd>{product()!.size}</dd>
                </Show>

                <Show when={product()!.weightKg}>
                  <dt>Weight</dt>
                  <dd>
                    <DecimalUnits value={product()!.weightKg!} unit="kg" />
                  </dd>
                </Show>

                <Show when={product()!.dimensionsCm}>
                  <dt>Dimensions</dt>
                  <dd>{product()!.dimensionsCm}</dd>
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
            <Show when={product()!.grade || product()!.safetyRating || product()!.customerRating || product()!.ecoScore}>
              <div class="health-section">
                <h2>Quality & Ratings</h2>
                <div class="score-grid">
                  <Show when={product()!.grade}>
                    <div class="score-item">
                      <span class="score-label">Grade</span>
                      <GradeBadge value={product()!.grade!} />
                    </div>
                  </Show>

                  <Show when={product()!.safetyRating}>
                    <div class="score-item">
                      <span class="score-label">Safety Rating</span>
                      <NovaDots value={product()!.safetyRating!} />
                    </div>
                  </Show>

                  <Show when={product()!.ecoScore}>
                    <div class="score-item">
                      <span class="score-label">Eco Score</span>
                      <ProgressBar value={product()!.ecoScore!} />
                    </div>
                  </Show>
                </div>
              </div>
            </Show>

            {/* Statistics Section */}
            <Show when={product()!.unitsSold || product()!.reviewCount}>
              <div class="stats-section">
                <h2>Statistics</h2>
                <dl class="info-list">
                  <Show when={product()!.unitsSold}>
                    <dt>Units Sold</dt>
                    <dd>
                      <LargeCounter value={product()!.unitsSold!} />
                    </dd>
                  </Show>

                  <Show when={product()!.reviewCount}>
                    <dt>Review Count</dt>
                    <dd>
                      <LargeCounter value={product()!.reviewCount!} />
                    </dd>
                  </Show>

                  <Show when={product()!.customerRating}>
                    <dt>Customer Rating</dt>
                    <dd>
                      <StarRating value={product()!.customerRating!} />
                    </dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Pricing & Financial Section */}
            <Show when={product()!.price || product()!.cost || product()!.wholesalePrice}>
              <div class="pricing-section">
                <h2>Pricing & Financial</h2>
                <dl class="info-list">
                  <Show when={product()!.price}>
                    <dt>Price</dt>
                    <dd>
                      <DecimalUnits value={product()!.price!} unit={product()!.currencyCode || ''} />
                    </dd>
                  </Show>

                  <Show when={product()!.cost}>
                    <dt>Cost</dt>
                    <dd>
                      <DecimalUnits value={product()!.cost!} unit={product()!.currencyCode || ''} />
                    </dd>
                  </Show>

                  <Show when={product()!.wholesalePrice}>
                    <dt>Wholesale Price</dt>
                    <dd>
                      <DecimalUnits value={product()!.wholesalePrice!} unit={product()!.currencyCode || ''} />
                    </dd>
                  </Show>

                  <Show when={product()!.taxRate !== undefined}>
                    <dt>Tax Rate</dt>
                    <dd>
                      <DecimalUnits value={product()!.taxRate!} unit="%" />
                    </dd>
                  </Show>

                  <Show when={product()!.discountPercent !== undefined}>
                    <dt>Discount</dt>
                    <dd>
                      <DecimalUnits value={product()!.discountPercent!} unit="%" />
                    </dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Inventory Section */}
            <Show when={product()!.stockQuantity !== undefined || product()!.warehouseLocation || product()!.reorderLevel !== undefined}>
              <div class="inventory-section">
                <h2>Inventory</h2>
                <dl class="info-list">
                  <Show when={product()!.stockQuantity !== undefined}>
                    <dt>Stock Quantity</dt>
                    <dd>
                      <DecimalUnits value={product()!.stockQuantity!} />
                    </dd>
                  </Show>

                  <Show when={product()!.reorderLevel !== undefined}>
                    <dt>Reorder Level</dt>
                    <dd>
                      <DecimalUnits value={product()!.reorderLevel!} />
                    </dd>
                  </Show>

                  <Show when={product()!.warehouseLocation}>
                    <dt>Warehouse Location</dt>
                    <dd>{product()!.warehouseLocation}</dd>
                  </Show>

                  <Show when={product()!.inStock !== undefined}>
                    <dt>In Stock</dt>
                    <dd>
                      <BooleanYesNo value={product()!.inStock!} />
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
            <Show when={product()!.originCountry || product()!.manufacturerCountry || product()!.shippingZone}>
              <div class="geographic-section">
                <h2>Geographic Information</h2>
                <dl class="info-list">
                  <Show when={product()!.originCountry}>
                    <dt>Origin Country</dt>
                    <dd>{product()!.originCountry}</dd>
                  </Show>

                  <Show when={product()!.manufacturerCountry}>
                    <dt>Manufacturer Country</dt>
                    <dd>{product()!.manufacturerCountry}</dd>
                  </Show>

                  <Show when={product()!.shippingZone}>
                    <dt>Shipping Zone</dt>
                    <dd>{product()!.shippingZone}</dd>
                  </Show>

                  <Show when={product()!.productLanguage}>
                    <dt>Product Language</dt>
                    <dd>{product()!.productLanguage}</dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Supplier Contact Section */}
            <Show when={product()!.firstName || product()!.lastName || product()!.supplierEmail || product()!.supplierPhone}>
              <div class="supplier-section">
                <h2>Supplier Contact</h2>
                <dl class="info-list">
                  <Show when={product()!.firstName || product()!.lastName}>
                    <dt>Contact Name</dt>
                    <dd>{product()!.firstName} {product()!.lastName}</dd>
                  </Show>

                  <Show when={product()!.supplierEmail}>
                    <dt>Email</dt>
                    <dd>
                      <span class="truncate-ellipsis" title={product()!.supplierEmail}>{product()!.supplierEmail}</span>
                    </dd>
                  </Show>

                  <Show when={product()!.supplierPhone}>
                    <dt>Phone</dt>
                    <dd>{product()!.supplierPhone}</dd>
                  </Show>

                  <Show when={product()!.supplierTaxId}>
                    <dt>Tax ID</dt>
                    <dd>{product()!.supplierTaxId}</dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Product Features Section */}
            <Show when={product()!.isFeatured || product()!.isBestSeller || product()!.requiresShipping || product()!.isDigital || product()!.hasWarranty}>
              <div class="features-section">
                <h2>Product Features</h2>
                <dl class="info-list">
                  <Show when={product()!.isFeatured !== undefined}>
                    <dt>Featured</dt>
                    <dd>
                      <BooleanYesNo value={product()!.isFeatured!} />
                    </dd>
                  </Show>

                  <Show when={product()!.isBestSeller !== undefined}>
                    <dt>Best Seller</dt>
                    <dd>
                      <BooleanYesNo value={product()!.isBestSeller!} />
                    </dd>
                  </Show>

                  <Show when={product()!.requiresShipping !== undefined}>
                    <dt>Requires Shipping</dt>
                    <dd>
                      <BooleanYesNo value={product()!.requiresShipping!} />
                    </dd>
                  </Show>

                  <Show when={product()!.isDigital !== undefined}>
                    <dt>Digital Product</dt>
                    <dd>
                      <BooleanYesNo value={product()!.isDigital!} />
                    </dd>
                  </Show>

                  <Show when={product()!.hasWarranty !== undefined}>
                    <dt>Has Warranty</dt>
                    <dd>
                      <BooleanYesNo value={product()!.hasWarranty!} />
                    </dd>
                  </Show>

                  <Show when={product()!.warrantyMonths !== undefined}>
                    <dt>Warranty Period</dt>
                    <dd>
                      <DecimalUnits value={product()!.warrantyMonths!} unit="months" />
                    </dd>
                  </Show>

                  <Show when={product()!.certification}>
                    <dt>Certification</dt>
                    <dd>{product()!.certification}</dd>
                  </Show>
                </dl>
              </div>
            </Show>

            {/* Shipping Section */}
            <Show when={product()!.shippingDepartureTime || product()!.flightDurationHours !== undefined}>
              <div class="shipping-section">
                <h2>Shipping Information</h2>
                <dl class="info-list">
                  <Show when={product()!.shippingDepartureTime}>
                    <dt>Departure Time</dt>
                    <dd>
                      <TimeFormat value={product()!.shippingDepartureTime!} />
                    </dd>
                  </Show>

                  <Show when={product()!.flightDurationHours !== undefined}>
                    <dt>Flight Duration</dt>
                    <dd>
                      <DecimalUnits value={product()!.flightDurationHours!} unit="hours" />
                    </dd>
                  </Show>
                </dl>
              </div>
            </Show>
          </div>
        </div>
      </Show>

        </Show>
        </Suspense>
      </div>
    </div>
  );
}
