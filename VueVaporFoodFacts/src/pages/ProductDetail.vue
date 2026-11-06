<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProduct } from '../composables/useProduct';
import {
  ProgressBar,
  GradeBadge,
  NovaDots,
  ProductImage,
  TruncatedText,
  LargeCounter,
  AbsoluteDate,
  RelativeDate,
  BooleanYesNo,
  DecimalUnits,
  TimeFormat,
  StarRating,
  ColorPill,
} from '../components/display';
import './ProductDetail.css';

// Route param passed as a prop via `props: true` on the route
const { code } = defineProps<{ code: string }>();

const router = useRouter();
const { product, loading, error, adjacent } = useProduct(() => code ?? '');

const navigateToList = () => {
  router.push('/list');
};

const navigateToPrevious = () => {
  if (adjacent.value?.previousId) {
    router.push(`/detail/${adjacent.value.previousId}`);
  }
};

const navigateToNext = () => {
  if (adjacent.value?.nextId) {
    router.push(`/detail/${adjacent.value.nextId}`);
  }
};

const hasPrevious = computed(() => adjacent.value?.previousId != null);
const hasNext = computed(() => adjacent.value?.nextId != null);
const positionInfo = computed(() =>
  adjacent.value ? `${adjacent.value.currentIndex} of ${adjacent.value.total}` : ''
);

const toISOString = (value: Date | string | null | undefined): string => {
  let result: string;
  if (!value) {
    result = '';
  } else {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      result = '';
    } else {
      result = date.toISOString();
    }
  }
  return result;
};

const createdDate = computed(() => toISOString(product.value?.createdDate));
const lastModifiedDate = computed(() => toISOString(product.value?.lastUpdated));
const releaseDate = computed(() => toISOString(product.value?.releaseDate));
const nextRestockDate = computed(() => toISOString(product.value?.nextRestockDate));
</script>

<template>
  <div class="product-detail-container">
    <div class="navigation-bar">
      <button class="back-button" @click="navigateToList">← Back to List</button>
      <div class="product-navigation">
        <button :disabled="!hasPrevious" class="nav-button" @click="navigateToPrevious">← Previous</button>
        <span class="position-info">{{ positionInfo }}</span>
        <button :disabled="!hasNext" class="nav-button" @click="navigateToNext">Next →</button>
      </div>
    </div>
    <div class="detail-area">
      <div v-if="loading" class="loading-overlay">
        <span class="loading-indicator">⏳ Loading...</span>
      </div>

      <div v-if="product" class="product-detail">
        <div class="header-section">
          <h1>{{ product.productName || 'Unknown Product' }}</h1>
          <div class="header-meta">
            <span class="product-code">Code: {{ product.code }}</span>
            <ProgressBar v-if="product.qualityScore" :value="product.qualityScore" />
            <!-- Mirrors React's `{0 && …}`, which renders the number 0 as text -->
            <template v-else-if="product.qualityScore === 0">0</template>
          </div>
        </div>

        <div class="content-grid">
          <!-- Image Gallery Section -->
          <div v-if="product.imageUrl" class="image-gallery">
            <h2>Product Images</h2>
            <div class="main-image">
              <ProductImage :value="product.imageUrl" size="large" />
            </div>
          </div>

          <!-- Basic Information Section -->
          <div class="info-section">
            <h2>Basic Information</h2>
            <dl class="info-list">
              <dt>Product Name</dt>
              <dd>{{ product.productName || 'N/A' }}</dd>

              <dt>Brand</dt>
              <dd>{{ product.brand || 'N/A' }}</dd>

              <dt>Category</dt>
              <dd>{{ product.category || 'N/A' }}</dd>

              <template v-if="product.description">
                <dt>Description</dt>
                <dd>
                  <TruncatedText :value="product.description" />
                </dd>
              </template>

              <template v-if="product.sku">
                <dt>SKU</dt>
                <dd>{{ product.sku }}</dd>
              </template>

              <template v-if="product.modelNumber">
                <dt>Model Number</dt>
                <dd>{{ product.modelNumber }}</dd>
              </template>

              <template v-if="product.barcode">
                <dt>Barcode</dt>
                <dd>{{ product.barcode }}</dd>
              </template>

              <template v-if="product.color">
                <dt>Color</dt>
                <dd>
                  <ColorPill :value="product.color" />
                </dd>
              </template>

              <template v-if="product.material">
                <dt>Material</dt>
                <dd>{{ product.material }}</dd>
              </template>

              <template v-if="product.size">
                <dt>Size</dt>
                <dd>{{ product.size }}</dd>
              </template>

              <template v-if="product.weightKg">
                <dt>Weight</dt>
                <dd>
                  <DecimalUnits :value="product.weightKg" unit="kg" />
                </dd>
              </template>

              <template v-if="product.dimensionsCm">
                <dt>Dimensions</dt>
                <dd>{{ product.dimensionsCm }}</dd>
              </template>

              <dt>Created</dt>
              <dd>
                <AbsoluteDate :value="createdDate" />
              </dd>

              <dt>Last Updated</dt>
              <dd>
                <RelativeDate :value="lastModifiedDate" />
              </dd>

              <template v-if="releaseDate">
                <dt>Release Date</dt>
                <dd>
                  <AbsoluteDate :value="releaseDate" />
                </dd>
              </template>
            </dl>
          </div>

          <!-- Quality & Ratings Section -->
          <div
            v-if="product.grade || product.safetyRating || product.customerRating || product.ecoScore"
            class="health-section"
          >
            <h2>Quality &amp; Ratings</h2>
            <div class="score-grid">
              <div v-if="product.grade" class="score-item">
                <span class="score-label">Grade</span>
                <GradeBadge :grade="product.grade" />
              </div>

              <div v-if="product.safetyRating" class="score-item">
                <span class="score-label">Safety Rating</span>
                <NovaDots :rating="product.safetyRating" />
              </div>

              <div v-if="product.ecoScore" class="score-item">
                <span class="score-label">Eco Score</span>
                <ProgressBar :value="product.ecoScore" />
              </div>
            </div>
          </div>

          <!-- Statistics Section -->
          <div v-if="product.unitsSold || product.reviewCount" class="stats-section">
            <h2>Statistics</h2>
            <dl class="info-list">
              <template v-if="product.unitsSold">
                <dt>Units Sold</dt>
                <dd>
                  <LargeCounter :value="product.unitsSold" />
                </dd>
              </template>

              <template v-if="product.reviewCount">
                <dt>Review Count</dt>
                <dd>
                  <LargeCounter :value="product.reviewCount" />
                </dd>
              </template>

              <template v-if="product.customerRating">
                <dt>Customer Rating</dt>
                <dd>
                  <StarRating :value="product.customerRating" />
                </dd>
              </template>
            </dl>
          </div>

          <!-- Pricing & Financial Section -->
          <div v-if="product.price || product.cost || product.wholesalePrice" class="pricing-section">
            <h2>Pricing &amp; Financial</h2>
            <dl class="info-list">
              <template v-if="product.price">
                <dt>Price</dt>
                <dd>
                  <DecimalUnits :value="product.price" :unit="product.currencyCode || ''" />
                </dd>
              </template>

              <template v-if="product.cost">
                <dt>Cost</dt>
                <dd>
                  <DecimalUnits :value="product.cost" :unit="product.currencyCode || ''" />
                </dd>
              </template>

              <template v-if="product.wholesalePrice">
                <dt>Wholesale Price</dt>
                <dd>
                  <DecimalUnits :value="product.wholesalePrice" :unit="product.currencyCode || ''" />
                </dd>
              </template>

              <template v-if="product.taxRate !== undefined">
                <dt>Tax Rate</dt>
                <dd>
                  <DecimalUnits :value="product.taxRate" unit="%" />
                </dd>
              </template>

              <template v-if="product.discountPercent !== undefined">
                <dt>Discount</dt>
                <dd>
                  <DecimalUnits :value="product.discountPercent" unit="%" />
                </dd>
              </template>
            </dl>
          </div>

          <!-- Inventory Section -->
          <div
            v-if="product.stockQuantity !== undefined || product.warehouseLocation || product.reorderLevel !== undefined"
            class="inventory-section"
          >
            <h2>Inventory</h2>
            <dl class="info-list">
              <template v-if="product.stockQuantity !== undefined">
                <dt>Stock Quantity</dt>
                <dd>
                  <DecimalUnits :value="product.stockQuantity" />
                </dd>
              </template>

              <template v-if="product.reorderLevel !== undefined">
                <dt>Reorder Level</dt>
                <dd>
                  <DecimalUnits :value="product.reorderLevel" />
                </dd>
              </template>

              <template v-if="product.warehouseLocation">
                <dt>Warehouse Location</dt>
                <dd>{{ product.warehouseLocation }}</dd>
              </template>

              <template v-if="product.inStock !== undefined">
                <dt>In Stock</dt>
                <dd>
                  <BooleanYesNo :value="product.inStock" />
                </dd>
              </template>

              <template v-if="nextRestockDate">
                <dt>Next Restock</dt>
                <dd>
                  <AbsoluteDate :value="nextRestockDate" />
                </dd>
              </template>
            </dl>
          </div>

          <!-- Geographic Section -->
          <div
            v-if="product.originCountry || product.manufacturerCountry || product.shippingZone"
            class="geographic-section"
          >
            <h2>Geographic Information</h2>
            <dl class="info-list">
              <template v-if="product.originCountry">
                <dt>Origin Country</dt>
                <dd>{{ product.originCountry }}</dd>
              </template>

              <template v-if="product.manufacturerCountry">
                <dt>Manufacturer Country</dt>
                <dd>{{ product.manufacturerCountry }}</dd>
              </template>

              <template v-if="product.shippingZone">
                <dt>Shipping Zone</dt>
                <dd>{{ product.shippingZone }}</dd>
              </template>

              <template v-if="product.productLanguage">
                <dt>Product Language</dt>
                <dd>{{ product.productLanguage }}</dd>
              </template>
            </dl>
          </div>

          <!-- Supplier Contact Section -->
          <div
            v-if="product.firstName || product.lastName || product.supplierEmail || product.supplierPhone"
            class="supplier-section"
          >
            <h2>Supplier Contact</h2>
            <dl class="info-list">
              <template v-if="product.firstName || product.lastName">
                <dt>Contact Name</dt>
                <dd>{{ product.firstName }} {{ product.lastName }}</dd>
              </template>

              <template v-if="product.supplierEmail">
                <dt>Email</dt>
                <dd>
                  <span class="truncate-ellipsis" :title="product.supplierEmail">{{ product.supplierEmail }}</span>
                </dd>
              </template>

              <template v-if="product.supplierPhone">
                <dt>Phone</dt>
                <dd>{{ product.supplierPhone }}</dd>
              </template>

              <template v-if="product.supplierTaxId">
                <dt>Tax ID</dt>
                <dd>{{ product.supplierTaxId }}</dd>
              </template>
            </dl>
          </div>

          <!-- Product Features Section -->
          <div
            v-if="
              product.isFeatured ||
              product.isBestSeller ||
              product.requiresShipping ||
              product.isDigital ||
              product.hasWarranty
            "
            class="features-section"
          >
            <h2>Product Features</h2>
            <dl class="info-list">
              <template v-if="product.isFeatured !== undefined">
                <dt>Featured</dt>
                <dd>
                  <BooleanYesNo :value="product.isFeatured" />
                </dd>
              </template>

              <template v-if="product.isBestSeller !== undefined">
                <dt>Best Seller</dt>
                <dd>
                  <BooleanYesNo :value="product.isBestSeller" />
                </dd>
              </template>

              <template v-if="product.requiresShipping !== undefined">
                <dt>Requires Shipping</dt>
                <dd>
                  <BooleanYesNo :value="product.requiresShipping" />
                </dd>
              </template>

              <template v-if="product.isDigital !== undefined">
                <dt>Digital Product</dt>
                <dd>
                  <BooleanYesNo :value="product.isDigital" />
                </dd>
              </template>

              <template v-if="product.hasWarranty !== undefined">
                <dt>Has Warranty</dt>
                <dd>
                  <BooleanYesNo :value="product.hasWarranty" />
                </dd>
              </template>

              <template v-if="product.warrantyMonths !== undefined">
                <dt>Warranty Period</dt>
                <dd>
                  <DecimalUnits :value="product.warrantyMonths" unit="months" />
                </dd>
              </template>

              <template v-if="product.certification">
                <dt>Certification</dt>
                <dd>{{ product.certification }}</dd>
              </template>
            </dl>
          </div>

          <!-- Shipping Section -->
          <div
            v-if="product.shippingDepartureTime || product.flightDurationHours !== undefined"
            class="shipping-section"
          >
            <h2>Shipping Information</h2>
            <dl class="info-list">
              <template v-if="product.shippingDepartureTime">
                <dt>Departure Time</dt>
                <dd>
                  <TimeFormat :value="product.shippingDepartureTime" />
                </dd>
              </template>

              <template v-if="product.flightDurationHours !== undefined">
                <dt>Flight Duration</dt>
                <dd>
                  <DecimalUnits :value="product.flightDurationHours" unit="hours" />
                </dd>
              </template>
            </dl>
          </div>
        </div>
      </div>
      <div v-else-if="loading" class="loading-state">
        <p>Loading product...</p>
      </div>
      <div v-else-if="error" class="error-state">
        <p>Error loading product: {{ error }}</p>
      </div>
      <div v-else class="not-found-state">
        <p>Product not found.</p>
      </div>
    </div>
  </div>
</template>
