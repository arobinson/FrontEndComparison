import { Injectable, resource, signal, Signal } from '@angular/core';
import {
  buildProductsByCategoryUrl,
  buildProductUrl,
  buildProductsSearchUrl,
} from 'shared-types';

/**
 * Raw product data from mock API
 */
interface RawProduct {
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
 * Flat product view model for client-side rendering (all 54 fields from mock data, camelCase)
 */
export interface ProductViewModel {
  // Core identifiers (required)
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

/**
 * Transform raw mock data to view model (flat structure for performance)
 */
function transformMockDataToViewModel(product: RawProduct): ProductViewModel {
  const result: ProductViewModel = {
    // Core identifiers (required)
    code: String(product.id),
    productName: product.product_name,
    category: product.category,
    createdDate: new Date(product.created_date),
    lastUpdated: new Date(product.last_updated),
  };

  // Map all optional fields (only add if they exist)
  if (product.brand) result.brand = product.brand;
  if (product.description) result.description = product.description;
  if (product.sku) result.sku = product.sku;
  if (product.model_number) result.modelNumber = product.model_number;
  if (product.barcode) result.barcode = product.barcode;

  // Contact
  if (product.first_name) result.firstName = product.first_name;
  if (product.last_name) result.lastName = product.last_name;
  if (product.supplier_email) result.supplierEmail = product.supplier_email;
  if (product.supplier_phone) result.supplierPhone = product.supplier_phone;

  // Financial
  if (product.price) result.price = product.price;
  if (product.cost) result.cost = product.cost;
  if (product.wholesale_price) result.wholesalePrice = product.wholesale_price;
  if (product.currency_code) result.currencyCode = product.currency_code;
  if (product.tax_rate !== undefined) result.taxRate = product.tax_rate;
  if (product.discount_percent !== undefined)
    result.discountPercent = product.discount_percent;

  // Inventory
  if (product.stock_quantity !== undefined)
    result.stockQuantity = product.stock_quantity;
  if (product.units_sold !== undefined) result.unitsSold = product.units_sold;
  if (product.reorder_level !== undefined)
    result.reorderLevel = product.reorder_level;
  if (product.warehouse_location)
    result.warehouseLocation = product.warehouse_location;

  // Quality
  if (product.quality_score !== undefined)
    result.qualityScore = product.quality_score;
  if (product.customer_rating !== undefined)
    result.customerRating = product.customer_rating;
  if (product.review_count !== undefined)
    result.reviewCount = product.review_count;
  if (product.grade) result.grade = product.grade;
  if (product.safety_rating !== undefined)
    result.safetyRating = product.safety_rating;
  if (product.eco_score !== undefined) result.ecoScore = product.eco_score;

  // Dates
  if (product.release_date) result.releaseDate = new Date(product.release_date);
  if (product.next_restock_date)
    result.nextRestockDate = new Date(product.next_restock_date);

  // Flags
  if (product.in_stock !== undefined) result.inStock = product.in_stock;
  if (product.is_featured !== undefined)
    result.isFeatured = product.is_featured;
  if (product.is_best_seller !== undefined)
    result.isBestSeller = product.is_best_seller;
  if (product.requires_shipping !== undefined)
    result.requiresShipping = product.requires_shipping;
  if (product.is_digital !== undefined) result.isDigital = product.is_digital;
  if (product.has_warranty !== undefined)
    result.hasWarranty = product.has_warranty;

  // Visual
  if (product.image_url) result.imageUrl = product.image_url;
  if (product.color) result.color = product.color;
  if (product.thumbnail_url) result.thumbnailUrl = product.thumbnail_url;

  // Geographic
  if (product.origin_country) result.originCountry = product.origin_country;
  if (product.manufacturer_country)
    result.manufacturerCountry = product.manufacturer_country;
  if (product.product_language)
    result.productLanguage = product.product_language;
  if (product.shipping_zone) result.shippingZone = product.shipping_zone;

  // Technical
  if (product.supplier_tax_id) result.supplierTaxId = product.supplier_tax_id;
  if (product.material) result.material = product.material;
  if (product.size) result.size = product.size;
  if (product.weight_kg !== undefined) result.weightKg = product.weight_kg;
  if (product.dimensions_cm) result.dimensionsCm = product.dimensions_cm;
  if (product.certification) result.certification = product.certification;
  if (product.warranty_months !== undefined)
    result.warrantyMonths = product.warranty_months;

  // Time
  if (product.shipping_departure_time)
    result.shippingDepartureTime = product.shipping_departure_time;
  if (product.flight_duration_hours !== undefined)
    result.flightDurationHours = product.flight_duration_hours;

  return result;
}

@Injectable({
  providedIn: 'root',
})
export class FoodFacts {
  /**
   * Create a resource for products by category
   */
  createProductsByCategoryResource(
    category: Signal<string>,
    page: Signal<number>,
    pageSize: Signal<number>,
  ) {
    return resource({
      params: () => ({
        category: category(),
        page: page(),
        pageSize: pageSize(),
      }),
      loader: async ({ params }) => {
        const url = buildProductsByCategoryUrl(
          params.category,
          params.page,
          params.pageSize,
        );
        const response = await fetch(url);
        const data = (await response.json()) as {
          products?: RawProduct[];
          total?: number;
        };

        let result;
        // Transform raw mock data to ProductViewModel on client side
        if (data?.products) {
          result = {
            products: data.products.map(transformMockDataToViewModel),
            total: data.total || 0,
          };
        } else {
          result = {
            products: [],
            total: 0,
          };
        }
        return result;
      },
    });
  }

  /**
   * Create a resource for a specific product by code
   */
  createProductResource(code: Signal<string>) {
    return resource({
      loader: async () => {
        const url = buildProductUrl(code());
        const response = await fetch(url);

        let result;
        if (!response.ok) {
          result = null;
        } else {
          const rawProduct = await response.json();
          result = transformMockDataToViewModel(rawProduct);
        }
        return result;
      },
    });
  }

  /**
   * Create a resource for products by search query
   */
  createProductsSearchResource(
    query: Signal<string>,
    page = signal(1),
    pageSize = signal(50),
  ) {
    return resource({
      loader: async () => {
        const url = buildProductsSearchUrl(query(), page(), pageSize());
        const response = await fetch(url);
        const data = (await response.json()) as {
          products?: ProductViewModel[];
        };

        // Local backend already returns transformed ProductViewModel objects
        return data?.products || [];
      },
    });
  }
}
