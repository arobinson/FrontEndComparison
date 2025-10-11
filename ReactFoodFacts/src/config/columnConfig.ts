export type ColumnDataType =
  | 'simple-text'
  | 'truncated-text'
  | 'progress-bar'
  | 'grade-badge'
  | 'nova-dots'
  | 'large-counter'
  | 'decimal-units'
  | 'absolute-date'
  | 'relative-date'
  | 'time-format'
  | 'boolean-yesno'
  | 'product-image'
  | 'product-link'
  | 'star-rating';

export interface ColumnConfig {
  key: string;
  label: string;
  type: ColumnDataType;
  unit?: string;
  filterable?: boolean;
  sortable?: boolean;
}

export const allColumns: ColumnConfig[] = [
  { key: 'code', label: 'ID', type: 'product-link', filterable: false, sortable: true },
  { key: 'productName', label: 'Product Name', type: 'simple-text', filterable: true, sortable: true },
  { key: 'brand', label: 'Brand', type: 'simple-text', filterable: true, sortable: true },
  { key: 'description', label: 'Description', type: 'truncated-text', filterable: true, sortable: false },
  { key: 'category', label: 'Category', type: 'simple-text', filterable: true, sortable: true },
  { key: 'sku', label: 'SKU', type: 'simple-text', filterable: true, sortable: true },
  { key: 'modelNumber', label: 'Model Number', type: 'simple-text', filterable: true, sortable: true },
  { key: 'barcode', label: 'Barcode', type: 'simple-text', filterable: true, sortable: true },
  { key: 'firstName', label: 'First Name', type: 'simple-text', filterable: true, sortable: true },
  { key: 'lastName', label: 'Last Name', type: 'simple-text', filterable: true, sortable: true },
  { key: 'supplierEmail', label: 'Supplier Email', type: 'simple-text', filterable: true, sortable: true },
  { key: 'supplierPhone', label: 'Supplier Phone', type: 'simple-text', filterable: true, sortable: true },
  { key: 'price', label: 'Price', type: 'simple-text', filterable: true, sortable: true },
  { key: 'cost', label: 'Cost', type: 'simple-text', filterable: true, sortable: true },
  { key: 'wholesalePrice', label: 'Wholesale Price', type: 'simple-text', filterable: true, sortable: true },
  { key: 'currencyCode', label: 'Currency', type: 'simple-text', filterable: true, sortable: true },
  { key: 'taxRate', label: 'Tax Rate', type: 'decimal-units', unit: '%', filterable: true, sortable: true },
  { key: 'discountPercent', label: 'Discount %', type: 'decimal-units', unit: '%', filterable: true, sortable: true },
  { key: 'stockQuantity', label: 'Stock Quantity', type: 'large-counter', filterable: true, sortable: true },
  { key: 'unitsSold', label: 'Units Sold', type: 'large-counter', filterable: true, sortable: true },
  { key: 'reorderLevel', label: 'Reorder Level', type: 'large-counter', filterable: true, sortable: true },
  { key: 'warehouseLocation', label: 'Warehouse', type: 'simple-text', filterable: true, sortable: true },
  { key: 'qualityScore', label: 'Quality Score', type: 'progress-bar', filterable: true, sortable: true },
  { key: 'customerRating', label: 'Rating', type: 'star-rating', filterable: true, sortable: true },
  { key: 'reviewCount', label: 'Reviews', type: 'large-counter', filterable: true, sortable: true },
  { key: 'grade', label: 'Grade', type: 'grade-badge', filterable: true, sortable: true },
  { key: 'safetyRating', label: 'Safety Rating', type: 'nova-dots', filterable: true, sortable: true },
  { key: 'ecoScore', label: 'Eco Score', type: 'progress-bar', filterable: true, sortable: true },
  { key: 'createdDate', label: 'Created', type: 'absolute-date', filterable: false, sortable: true },
  { key: 'lastUpdated', label: 'Last Updated', type: 'relative-date', filterable: false, sortable: true },
  { key: 'releaseDate', label: 'Release Date', type: 'absolute-date', filterable: false, sortable: true },
  { key: 'nextRestockDate', label: 'Next Restock', type: 'absolute-date', filterable: false, sortable: true },
  { key: 'inStock', label: 'In Stock', type: 'boolean-yesno', filterable: true, sortable: true },
  { key: 'isFeatured', label: 'Featured', type: 'boolean-yesno', filterable: true, sortable: true },
  { key: 'isBestSeller', label: 'Best Seller', type: 'boolean-yesno', filterable: true, sortable: true },
  { key: 'requiresShipping', label: 'Requires Shipping', type: 'boolean-yesno', filterable: true, sortable: true },
  { key: 'isDigital', label: 'Digital', type: 'boolean-yesno', filterable: true, sortable: true },
  { key: 'hasWarranty', label: 'Has Warranty', type: 'boolean-yesno', filterable: true, sortable: true },
  { key: 'imageUrl', label: 'Image', type: 'product-image', filterable: false, sortable: false },
  { key: 'color', label: 'Color', type: 'simple-text', filterable: true, sortable: true },
  { key: 'thumbnailUrl', label: 'Thumbnail', type: 'product-image', filterable: false, sortable: false },
  { key: 'originCountry', label: 'Origin Country', type: 'simple-text', filterable: true, sortable: true },
  { key: 'manufacturerCountry', label: 'Manufacturer Country', type: 'simple-text', filterable: true, sortable: true },
  { key: 'productLanguage', label: 'Language', type: 'simple-text', filterable: true, sortable: true },
  { key: 'shippingZone', label: 'Shipping Zone', type: 'simple-text', filterable: true, sortable: true },
  { key: 'supplierTaxId', label: 'Supplier Tax ID', type: 'simple-text', filterable: true, sortable: true },
  { key: 'material', label: 'Material', type: 'simple-text', filterable: true, sortable: true },
  { key: 'size', label: 'Size', type: 'simple-text', filterable: true, sortable: true },
  { key: 'weightKg', label: 'Weight', type: 'decimal-units', unit: 'kg', filterable: true, sortable: true },
  { key: 'dimensionsCm', label: 'Dimensions', type: 'simple-text', filterable: true, sortable: true },
  { key: 'certification', label: 'Certification', type: 'simple-text', filterable: true, sortable: true },
  { key: 'warrantyMonths', label: 'Warranty (months)', type: 'large-counter', filterable: true, sortable: true },
  { key: 'shippingDepartureTime', label: 'Departure Time', type: 'time-format', filterable: false, sortable: true },
  { key: 'flightDurationHours', label: 'Flight Duration', type: 'decimal-units', unit: 'hrs', filterable: true, sortable: true },
];
