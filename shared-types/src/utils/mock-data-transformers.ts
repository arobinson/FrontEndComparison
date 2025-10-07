/**
 * Mock Data Transformers
 * Transform raw mock API data to view models
 */

import { RawMockProduct, MockProductViewModel } from '../types/mock-product.types.js';

/**
 * Transform raw mock data to view model (flat structure for performance)
 */
export function transformMockDataToViewModel(product: RawMockProduct): MockProductViewModel {
  const result: MockProductViewModel = {
    code: String(product.id),
    productName: product.product_name,
    category: product.category,
    createdDate: new Date(product.created_date),
    lastUpdated: new Date(product.last_updated),
  };

  if (product.brand) result.brand = product.brand;
  if (product.description) result.description = product.description;
  if (product.sku) result.sku = product.sku;
  if (product.model_number) result.modelNumber = product.model_number;
  if (product.barcode) result.barcode = product.barcode;

  if (product.first_name) result.firstName = product.first_name;
  if (product.last_name) result.lastName = product.last_name;
  if (product.supplier_email) result.supplierEmail = product.supplier_email;
  if (product.supplier_phone) result.supplierPhone = product.supplier_phone;

  if (product.price) result.price = product.price;
  if (product.cost) result.cost = product.cost;
  if (product.wholesale_price) result.wholesalePrice = product.wholesale_price;
  if (product.currency_code) result.currencyCode = product.currency_code;
  if (product.tax_rate !== undefined) result.taxRate = product.tax_rate;
  if (product.discount_percent !== undefined) result.discountPercent = product.discount_percent;

  if (product.stock_quantity !== undefined) result.stockQuantity = product.stock_quantity;
  if (product.units_sold !== undefined) result.unitsSold = product.units_sold;
  if (product.reorder_level !== undefined) result.reorderLevel = product.reorder_level;
  if (product.warehouse_location) result.warehouseLocation = product.warehouse_location;

  if (product.quality_score !== undefined) result.qualityScore = product.quality_score;
  if (product.customer_rating !== undefined) result.customerRating = product.customer_rating;
  if (product.review_count !== undefined) result.reviewCount = product.review_count;
  if (product.grade) result.grade = product.grade;
  if (product.safety_rating !== undefined) result.safetyRating = product.safety_rating;
  if (product.eco_score !== undefined) result.ecoScore = product.eco_score;

  if (product.release_date) result.releaseDate = new Date(product.release_date);
  if (product.next_restock_date) result.nextRestockDate = new Date(product.next_restock_date);

  if (product.in_stock !== undefined) result.inStock = product.in_stock;
  if (product.is_featured !== undefined) result.isFeatured = product.is_featured;
  if (product.is_best_seller !== undefined) result.isBestSeller = product.is_best_seller;
  if (product.requires_shipping !== undefined) result.requiresShipping = product.requires_shipping;
  if (product.is_digital !== undefined) result.isDigital = product.is_digital;
  if (product.has_warranty !== undefined) result.hasWarranty = product.has_warranty;

  if (product.image_url) result.imageUrl = product.image_url;
  if (product.color) result.color = product.color;
  if (product.thumbnail_url) result.thumbnailUrl = product.thumbnail_url;

  if (product.origin_country) result.originCountry = product.origin_country;
  if (product.manufacturer_country) result.manufacturerCountry = product.manufacturer_country;
  if (product.product_language) result.productLanguage = product.product_language;
  if (product.shipping_zone) result.shippingZone = product.shipping_zone;

  if (product.supplier_tax_id) result.supplierTaxId = product.supplier_tax_id;
  if (product.material) result.material = product.material;
  if (product.size) result.size = product.size;
  if (product.weight_kg !== undefined) result.weightKg = product.weight_kg;
  if (product.dimensions_cm) result.dimensionsCm = product.dimensions_cm;
  if (product.certification) result.certification = product.certification;
  if (product.warranty_months !== undefined) result.warrantyMonths = product.warranty_months;

  if (product.shipping_departure_time) result.shippingDepartureTime = product.shipping_departure_time;
  if (product.flight_duration_hours !== undefined) result.flightDurationHours = product.flight_duration_hours;

  return result;
}
