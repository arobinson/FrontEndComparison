import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FoodFacts } from '../food-facts';
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
   * All available columns from mock data (54 columns total)
   * For now, displaying all as simple text - will implement component types incrementally
   */
  readonly allColumns = [
    'id',
    'product_name',
    'brand',
    'description',
    'category',
    'sku',
    'model_number',
    'barcode',
    'first_name',
    'last_name',
    'supplier_email',
    'supplier_phone',
    'price',
    'cost',
    'wholesale_price',
    'currency_code',
    'tax_rate',
    'discount_percent',
    'stock_quantity',
    'units_sold',
    'reorder_level',
    'warehouse_location',
    'quality_score',
    'customer_rating',
    'review_count',
    'grade',
    'safety_rating',
    'eco_score',
    'created_date',
    'last_updated',
    'release_date',
    'next_restock_date',
    'in_stock',
    'is_featured',
    'is_best_seller',
    'requires_shipping',
    'is_digital',
    'has_warranty',
    'image_url',
    'color',
    'thumbnail_url',
    'origin_country',
    'manufacturer_country',
    'product_language',
    'shipping_zone',
    'supplier_tax_id',
    'material',
    'size',
    'weight_kg',
    'dimensions_cm',
    'certification',
    'warranty_months',
    'shipping_departure_time',
    'flight_duration_hours',
  ];

  /**
   * Mapping of column names to their data types for component selection
   * Starting with all as simple-text, will implement specific components incrementally
   */
  readonly columnDataTypes: Record<string, string> = {
    // Product link for ID
    id: this.dataTypes['product-link'],
    // Progress bars for scores
    quality_score: this.dataTypes['progress-bar'],
    eco_score: this.dataTypes['progress-bar'],
    // Grade badge
    grade: this.dataTypes['grade-badge'],
    // Nova dots for safety rating
    safety_rating: this.dataTypes['nova-dots'],
    // Truncated text for description
    description: this.dataTypes['truncated-text'],
    // Large counters
    units_sold: this.dataTypes['large-counter'],
    review_count: this.dataTypes['large-counter'],
    // Boolean yes/no
    in_stock: this.dataTypes['boolean-yesno'],
    is_featured: this.dataTypes['boolean-yesno'],
    is_best_seller: this.dataTypes['boolean-yesno'],
    requires_shipping: this.dataTypes['boolean-yesno'],
    is_digital: this.dataTypes['boolean-yesno'],
    has_warranty: this.dataTypes['boolean-yesno'],
    // Product images
    image_url: this.dataTypes['product-image'],
    thumbnail_url: this.dataTypes['product-image'],
    // Decimal units
    price: this.dataTypes['decimal-units'],
    cost: this.dataTypes['decimal-units'],
    wholesale_price: this.dataTypes['decimal-units'],
    weight_kg: this.dataTypes['decimal-units'],
    // Absolute dates
    created_date: this.dataTypes['absolute-date'],
    release_date: this.dataTypes['absolute-date'],
    next_restock_date: this.dataTypes['absolute-date'],
    // Relative date
    last_updated: this.dataTypes['relative-date'],
    // Time format
    shipping_departure_time: this.dataTypes['time-format'],
    // Rest as simple text
    ...Object.fromEntries(
      this.allColumns
        .filter(
          (col) =>
            ![
              'id',
              'quality_score',
              'eco_score',
              'grade',
              'safety_rating',
              'description',
              'units_sold',
              'review_count',
              'in_stock',
              'is_featured',
              'is_best_seller',
              'requires_shipping',
              'is_digital',
              'has_warranty',
              'image_url',
              'thumbnail_url',
              'price',
              'cost',
              'wholesale_price',
              'weight_kg',
              'created_date',
              'release_date',
              'next_restock_date',
              'last_updated',
              'shipping_departure_time',
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
  readonly hasData = computed(() => {
    const value = this.productsResource.value();
    return (
      this.productsResource.status() === 'resolved' && value && value.products.length > 0
    );
  });

  /**
   * Filtered data based on active filters (filters current page only)
   */
  readonly filteredData = computed(() => {
    const response = this.productsResource.value();
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
                  v === 'Yes' ? true : v === 'No' ? false : v,
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
    const response = this.productsResource.value();
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
