import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FoodFacts, ProductViewModel } from '../food-facts';
import { DataTable } from '../../shared/data-table/data-table';
import { ProductLink } from '../../shared/product-link/product-link';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { GradeBadge } from '../../shared/grade-badge/grade-badge';
import { NovaDots } from '../../shared/nova-dots/nova-dots';
import { TruncatedText } from '../../shared/truncated-text/truncated-text';
import { LargeCounter } from '../../shared/large-counter/large-counter';
import { BooleanYesno } from '../../shared/boolean-yesno/boolean-yesno';
import { ProductImage } from '../../shared/product-image/product-image';
import { DecimalUnits } from '../../shared/decimal-units/decimal-units';
import { AbsoluteDate } from '../../shared/absolute-date/absolute-date';
import { RelativeDate } from '../../shared/relative-date/relative-date';
import { TimeFormat } from '../../shared/time-format/time-format';
import { TextSearch } from '../../shared/filters/text-search/text-search';
import { RangeSlider } from '../../shared/filters/range-slider/range-slider';
import { MultiSelect } from '../../shared/filters/multi-select/multi-select';

@Component({
  selector: 'aff-product-list',
  imports: [
    CommonModule,
    RouterModule,
    DataTable,
    ProductLink,
    ProgressBar,
    GradeBadge,
    NovaDots,
    TruncatedText,
    LargeCounter,
    BooleanYesno,
    ProductImage,
    DecimalUnits,
    AbsoluteDate,
    RelativeDate,
    TimeFormat,
    TextSearch,
    RangeSlider,
    MultiSelect,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  readonly #foodFacts = inject(FoodFacts);

  readonly category = signal('all');

  // #region Pagination State

  /**
   * Current page for pagination (0-based for UI, 1-based for API)
   */
  readonly currentPage = signal(0);

  /**
   * Items per page
   */
  readonly pageSize = signal(50);

  /**
   * API page (1-based) computed from currentPage (0-based)
   */
  readonly apiPage = computed(() => this.currentPage() + 1);

  readonly productsResource = this.#foodFacts.createProductsByCategoryResource(
    this.category,
    this.apiPage,
    this.pageSize,
  );

  /**
   * Previous data to show while loading new page
   */
  readonly previousData = signal<{
    products: ProductViewModel[];
    total: number;
  } | null>(null);

  constructor() {
    // Update previousData whenever we get new resolved data
    effect(() => {
      const status = this.productsResource.status();
      const value = this.productsResource.value();
      if (status === 'resolved' && value) {
        this.previousData.set(value);
      }
    });
  }

  // #endregion

  // #region Column Configuration

  /**
   * Data types for different component rendering
   */
  readonly dataTypes = {
    'simple-text': 'simple-text',
    'truncated-text': 'truncated-text',
    'progress-bar': 'progress-bar',
    'grade-badge': 'grade-badge',
    'nova-dots': 'nova-dots',
    'large-counter': 'large-counter',
    'decimal-units': 'decimal-units',
    'simple-quantity': 'simple-quantity',
    'absolute-date': 'absolute-date',
    'relative-date': 'relative-date',
    'time-format': 'time-format',
    'boolean-yesno': 'boolean-yesno',
    'product-image': 'product-image',
    'product-link': 'product-link',
  } as const;

  /**
   * All available columns from ProductViewModel (54 columns total, camelCase)
   */
  readonly allColumns = [
    'code',
    'productName',
    'brand',
    'description',
    'category',
    'sku',
    'modelNumber',
    'barcode',
    'firstName',
    'lastName',
    'supplierEmail',
    'supplierPhone',
    'price',
    'cost',
    'wholesalePrice',
    'currencyCode',
    'taxRate',
    'discountPercent',
    'stockQuantity',
    'unitsSold',
    'reorderLevel',
    'warehouseLocation',
    'qualityScore',
    'customerRating',
    'reviewCount',
    'grade',
    'safetyRating',
    'ecoScore',
    'createdDate',
    'lastUpdated',
    'releaseDate',
    'nextRestockDate',
    'inStock',
    'isFeatured',
    'isBestSeller',
    'requiresShipping',
    'isDigital',
    'hasWarranty',
    'imageUrl',
    'color',
    'thumbnailUrl',
    'originCountry',
    'manufacturerCountry',
    'productLanguage',
    'shippingZone',
    'supplierTaxId',
    'material',
    'size',
    'weightKg',
    'dimensionsCm',
    'certification',
    'warrantyMonths',
    'shippingDepartureTime',
    'flightDurationHours',
  ];

  /**
   * Mapping of column names to their data types for component selection
   * Starting with all as simple-text, will implement specific components incrementally
   */
  readonly columnDataTypes: Record<string, string> = {
    // Product link for code (ID)
    code: this.dataTypes['product-link'],
    // Progress bars for scores
    qualityScore: this.dataTypes['progress-bar'],
    ecoScore: this.dataTypes['progress-bar'],
    // Grade badge
    grade: this.dataTypes['grade-badge'],
    // Nova dots for safety rating
    safetyRating: this.dataTypes['nova-dots'],
    // Truncated text for description
    description: this.dataTypes['truncated-text'],
    // Large counters
    unitsSold: this.dataTypes['large-counter'],
    reviewCount: this.dataTypes['large-counter'],
    // Boolean yes/no
    inStock: this.dataTypes['boolean-yesno'],
    isFeatured: this.dataTypes['boolean-yesno'],
    isBestSeller: this.dataTypes['boolean-yesno'],
    requiresShipping: this.dataTypes['boolean-yesno'],
    isDigital: this.dataTypes['boolean-yesno'],
    hasWarranty: this.dataTypes['boolean-yesno'],
    // Product images
    imageUrl: this.dataTypes['product-image'],
    thumbnailUrl: this.dataTypes['product-image'],
    // Decimal units
    price: this.dataTypes['decimal-units'],
    cost: this.dataTypes['decimal-units'],
    wholesalePrice: this.dataTypes['decimal-units'],
    weightKg: this.dataTypes['decimal-units'],
    // Absolute dates
    createdDate: this.dataTypes['absolute-date'],
    releaseDate: this.dataTypes['absolute-date'],
    nextRestockDate: this.dataTypes['absolute-date'],
    // Relative date
    lastUpdated: this.dataTypes['relative-date'],
    // Time format
    shippingDepartureTime: this.dataTypes['time-format'],
    // Rest as simple text
    ...Object.fromEntries(
      this.allColumns
        .filter(
          (col) =>
            ![
              'code',
              'qualityScore',
              'ecoScore',
              'grade',
              'safetyRating',
              'description',
              'unitsSold',
              'reviewCount',
              'inStock',
              'isFeatured',
              'isBestSeller',
              'requiresShipping',
              'isDigital',
              'hasWarranty',
              'imageUrl',
              'thumbnailUrl',
              'price',
              'cost',
              'wholesalePrice',
              'weightKg',
              'createdDate',
              'releaseDate',
              'nextRestockDate',
              'lastUpdated',
              'shippingDepartureTime',
            ].includes(col),
        )
        .map((col) => [col, this.dataTypes['simple-text']]),
    ),
  };

  /**
   * Column names for the data table (all 54 columns)
   */
  readonly columns = this.allColumns;

  /**
   * Get data type for a specific column
   */
  getColumnDataType(column: string): string {
    return this.columnDataTypes[column] || this.dataTypes['simple-text'];
  }

  /**
   * Convert camelCase column names to human-readable titles
   */
  getColumnTitle(column: string): string {
    const specialCases: Record<string, string> = {
      id: 'ID',
      product_name: 'Product Name',
      brand: 'Brand',
      description: 'Description',
      category: 'Category',
      sku: 'SKU',
      model_number: 'Model Number',
      barcode: 'Barcode',
      first_name: 'First Name',
      last_name: 'Last Name',
      supplier_email: 'Supplier Email',
      supplier_phone: 'Supplier Phone',
      price: 'Price',
      cost: 'Cost',
      wholesale_price: 'Wholesale Price',
      currency_code: 'Currency',
      tax_rate: 'Tax Rate',
      discount_percent: 'Discount %',
      stock_quantity: 'Stock',
      units_sold: 'Units Sold',
      reorder_level: 'Reorder Level',
      warehouse_location: 'Warehouse',
      quality_score: 'Quality Score',
      customer_rating: 'Rating',
      review_count: 'Reviews',
      grade: 'Grade',
      safety_rating: 'Safety Rating',
      eco_score: 'Eco Score',
      created_date: 'Created',
      last_updated: 'Last Updated',
      release_date: 'Released',
      next_restock_date: 'Next Restock',
      in_stock: 'In Stock',
      is_featured: 'Featured',
      is_best_seller: 'Best Seller',
      requires_shipping: 'Requires Shipping',
      is_digital: 'Digital',
      has_warranty: 'Has Warranty',
      image_url: 'Image',
      color: 'Color',
      thumbnail_url: 'Thumbnail',
      origin_country: 'Origin Country',
      manufacturer_country: 'Manufacturer Country',
      product_language: 'Language',
      shipping_zone: 'Shipping Zone',
      supplier_tax_id: 'Tax ID',
      material: 'Material',
      size: 'Size',
      weight_kg: 'Weight (kg)',
      dimensions_cm: 'Dimensions (cm)',
      certification: 'Certification',
      warranty_months: 'Warranty (months)',
      shipping_departure_time: 'Departure Time',
      flight_duration_hours: 'Flight Duration (hrs)',
    };

    return specialCases[column] || this.#camelCaseToTitle(column);
  }

  /**
   * Convert camelCase to Title Case as fallback
   */
  #camelCaseToTitle(str: string): string {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (char) => char.toUpperCase())
      .trim();
  }

  // #endregion

  // #region Filter State

  readonly filters = signal<Record<string, any>>({});
  readonly filterResetTrigger = signal(0);

  /**
   * Update filter for a specific column
   */
  updateFilter(column: string, value: any) {
    this.filters.update((current) => ({
      ...current,
      [column]: value,
    }));
    this.currentPage.set(0); // Reset to first page when filtering
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.filters.set({});
    this.currentPage.set(0);
    this.filterResetTrigger.update((val) => val + 1);
  }

  // #endregion

  // #region Computed Values

  readonly isLoading = computed(
    () => this.productsResource.status() === 'loading',
  );
  readonly isError = computed(() => this.productsResource.status() === 'error');

  /**
   * Current data or previous data if loading
   */
  readonly displayData = computed(() => {
    const current = this.productsResource.value();
    const previous = this.previousData();
    let result;
    if (current) {
      result = current;
    } else {
      result = previous;
    }
    return result;
  });

  readonly hasData = computed(() => {
    const data = this.displayData();
    return data && data.products.length > 0;
  });

  /**
   * Filtered data based on active filters (filters current page only)
   */
  readonly filteredData = computed(() => {
    const response = this.displayData();
    const allData = response?.products || [];
    const activeFilters = this.filters();

    let result = allData;
    if (Object.keys(activeFilters).length > 0) {
      result = allData.filter((product) => {
        let matches = true;
        for (const [column, filterValue] of Object.entries(activeFilters)) {
          if (!filterValue) continue;

          const productValue = (product as any)[column];

          // Text search
          if (typeof filterValue === 'string') {
            if (
              !productValue
                ?.toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase())
            ) {
              matches = false;
            }
          }
          // Range filter
          else if (
            filterValue.min !== undefined ||
            filterValue.max !== undefined
          ) {
            const numValue = Number(productValue);
            if (filterValue.min !== undefined && numValue < filterValue.min) {
              matches = false;
            }
            if (filterValue.max !== undefined && numValue > filterValue.max) {
              matches = false;
            }
          }
          // Multi-select
          else if (Array.isArray(filterValue)) {
            if (filterValue.length > 0) {
              // Handle boolean yes/no filters
              if (typeof productValue === 'boolean') {
                const boolStrings = filterValue.map((v) =>
                  (() => {
                    if (v === 'Yes') return true;
                    if (v === 'No') return false;
                    return v;
                  })(),
                );
                if (!boolStrings.includes(productValue)) {
                  matches = false;
                }
              } else if (!filterValue.includes(productValue)) {
                matches = false;
              }
            }
          }
        }
        return matches;
      });
    }
    return result;
  });

  /**
   * Current page data for the table (filtered current page)
   */
  readonly currentPageData = computed(() => {
    return this.filteredData();
  });

  /**
   * Total number of pages from server
   */
  readonly totalPages = computed(() => {
    const response = this.displayData();
    const total = response?.total || 0;
    return Math.ceil(total / this.pageSize());
  });

  // #endregion

  // #region Event Handlers

  /**
   * Handle page changes from the data table
   * @param newPage New page number
   */
  onPageChange(newPage: number) {
    this.currentPage.set(newPage);
  }

  /**
   * Handle page size changes from the data table
   * @param newPageSize New page size
   */
  onPageSizeChange(newPageSize: number) {
    this.pageSize.set(newPageSize);
    this.currentPage.set(0); // Reset to first page
  }

  // #endregion
}
