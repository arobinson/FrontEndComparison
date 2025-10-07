/**
 * Mock Product Data Types (54-field structure)
 * 
 * These types are for the MOCK_DATA.json structure used in the Backend
 * Different from OpenFoodFacts types in product.types.ts
 */

/**
 * Raw product data from mock API (snake_case from backend)
 */
export interface RawMockProduct {
  id: number;
  product_name: string;
  brand?: string;
  description?: string;
  category: string;
  sku?: string;
  model_number?: string;
  barcode?: string;
  first_name?: string;
  last_name?: string;
  supplier_email?: string;
  supplier_phone?: string;
  price?: string;
  cost?: string;
  wholesale_price?: string;
  currency_code?: string;
  tax_rate?: number;
  discount_percent?: number;
  stock_quantity?: number;
  units_sold?: number;
  reorder_level?: number;
  warehouse_location?: string;
  quality_score?: number;
  customer_rating?: number;
  review_count?: number;
  grade?: string;
  safety_rating?: number;
  eco_score?: number;
  created_date: string;
  last_updated: string;
  release_date?: string;
  next_restock_date?: string;
  in_stock?: boolean;
  is_featured?: boolean;
  is_best_seller?: boolean;
  requires_shipping?: boolean;
  is_digital?: boolean;
  has_warranty?: boolean;
  image_url?: string;
  color?: string;
  thumbnail_url?: string;
  origin_country?: string;
  manufacturer_country?: string;
  product_language?: string;
  shipping_zone?: string;
  supplier_tax_id?: string;
  material?: string;
  size?: string;
  weight_kg?: number;
  dimensions_cm?: string;
  certification?: string;
  warranty_months?: number;
  shipping_departure_time?: string;
  flight_duration_hours?: number;
}

/**
 * Mock Product View Model for client-side rendering (camelCase, all 54 fields)
 */
export interface MockProductViewModel {
  // Core identifiers
  code: string;
  productName: string;
  brand?: string;
  description?: string;
  category: string;
  sku?: string;
  modelNumber?: string;
  barcode?: string;

  // Contact
  firstName?: string;
  lastName?: string;
  supplierEmail?: string;
  supplierPhone?: string;

  // Financial
  price?: string;
  cost?: string;
  wholesalePrice?: string;
  currencyCode?: string;
  taxRate?: number;
  discountPercent?: number;

  // Inventory
  stockQuantity?: number;
  unitsSold?: number;
  reorderLevel?: number;
  warehouseLocation?: string;

  // Quality
  qualityScore?: number;
  customerRating?: number;
  reviewCount?: number;
  grade?: string;
  safetyRating?: number;
  ecoScore?: number;

  // Dates
  createdDate: Date;
  lastUpdated: Date;
  releaseDate?: Date;
  nextRestockDate?: Date;

  // Flags
  inStock?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  requiresShipping?: boolean;
  isDigital?: boolean;
  hasWarranty?: boolean;

  // Visual
  imageUrl?: string;
  color?: string;
  thumbnailUrl?: string;

  // Geographic
  originCountry?: string;
  manufacturerCountry?: string;
  productLanguage?: string;
  shippingZone?: string;

  // Technical
  supplierTaxId?: string;
  material?: string;
  size?: string;
  weightKg?: number;
  dimensionsCm?: string;
  certification?: string;
  warrantyMonths?: number;

  // Time
  shippingDepartureTime?: string;
  flightDurationHours?: number;
}
