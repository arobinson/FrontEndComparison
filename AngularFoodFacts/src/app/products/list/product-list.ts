import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FoodFacts } from '../food-facts';
import { DataTable } from '../../shared/data-table/data-table';

@Component({
  selector: 'aff-product-list',
  imports: [CommonModule, RouterModule, DataTable],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  readonly #foodFacts = inject(FoodFacts);
  
  readonly category = signal('all');
  readonly productsResource = this.#foodFacts.createProductsByCategoryResource(this.category);
  
  // #region Pagination State
  
  /**
   * Current page for pagination (0-based)
   */
  readonly currentPage = signal(0);
  
  /**
   * Items per page
   */
  readonly pageSize = signal(50);
  
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
    'boolean-yesno': 'boolean-yesno',
    'product-image': 'product-image',
    'product-link': 'product-link'
  } as const;
  
  /**
   * All available columns from mock data (54 columns total)
   * For now, displaying all as simple text - will implement component types incrementally
   */
  readonly allColumns = [
    'id', 'product_name', 'brand', 'description', 'category', 'sku', 'model_number', 'barcode',
    'first_name', 'last_name', 'supplier_email', 'supplier_phone', 'price', 'cost', 'wholesale_price',
    'currency_code', 'tax_rate', 'discount_percent', 'stock_quantity', 'units_sold', 'reorder_level',
    'warehouse_location', 'quality_score', 'customer_rating', 'review_count', 'grade', 'safety_rating',
    'eco_score', 'created_date', 'last_updated', 'release_date', 'next_restock_date', 'in_stock',
    'is_featured', 'is_best_seller', 'requires_shipping', 'is_digital', 'has_warranty', 'image_url',
    'color', 'thumbnail_url', 'origin_country', 'manufacturer_country', 'product_language', 'shipping_zone',
    'supplier_tax_id', 'material', 'size', 'weight_kg', 'dimensions_cm', 'certification', 'warranty_months',
    'shipping_departure_time', 'flight_duration_hours'
  ];

  /**
   * Mapping of column names to their data types for component selection
   * Starting with all as simple-text, will implement specific components incrementally
   */
  readonly columnDataTypes: Record<string, string> = {
    // Temporary: all columns as simple text for initial testing
    ...Object.fromEntries(this.allColumns.map(col => [col, this.dataTypes['simple-text']]))
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
      'id': 'ID',
      'product_name': 'Product Name',
      'brand': 'Brand',
      'description': 'Description',
      'category': 'Category',
      'sku': 'SKU',
      'model_number': 'Model Number',
      'barcode': 'Barcode',
      'first_name': 'First Name',
      'last_name': 'Last Name',
      'supplier_email': 'Supplier Email',
      'supplier_phone': 'Supplier Phone',
      'price': 'Price',
      'cost': 'Cost',
      'wholesale_price': 'Wholesale Price',
      'currency_code': 'Currency',
      'tax_rate': 'Tax Rate',
      'discount_percent': 'Discount %',
      'stock_quantity': 'Stock',
      'units_sold': 'Units Sold',
      'reorder_level': 'Reorder Level',
      'warehouse_location': 'Warehouse',
      'quality_score': 'Quality Score',
      'customer_rating': 'Rating',
      'review_count': 'Reviews',
      'grade': 'Grade',
      'safety_rating': 'Safety Rating',
      'eco_score': 'Eco Score',
      'created_date': 'Created',
      'last_updated': 'Last Updated',
      'release_date': 'Released',
      'next_restock_date': 'Next Restock',
      'in_stock': 'In Stock',
      'is_featured': 'Featured',
      'is_best_seller': 'Best Seller',
      'requires_shipping': 'Requires Shipping',
      'is_digital': 'Digital',
      'has_warranty': 'Has Warranty',
      'image_url': 'Image',
      'color': 'Color',
      'thumbnail_url': 'Thumbnail',
      'origin_country': 'Origin Country',
      'manufacturer_country': 'Manufacturer Country',
      'product_language': 'Language',
      'shipping_zone': 'Shipping Zone',
      'supplier_tax_id': 'Tax ID',
      'material': 'Material',
      'size': 'Size',
      'weight_kg': 'Weight (kg)',
      'dimensions_cm': 'Dimensions (cm)',
      'certification': 'Certification',
      'warranty_months': 'Warranty (months)',
      'shipping_departure_time': 'Departure Time',
      'flight_duration_hours': 'Flight Duration (hrs)'
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
  
  // #region Computed Values
  
  readonly isLoading = computed(() => this.productsResource.status() === 'loading');
  readonly isError = computed(() => this.productsResource.status() === 'error');
  readonly hasData = computed(() => {
    const value = this.productsResource.value();
    return this.productsResource.status() === 'resolved' && value && value.length > 0;
  });
  
  /**
   * Current page data for the table
   */
  readonly currentPageData = computed(() => {
    const allData = this.productsResource.value() || [];
    const startIndex = this.currentPage() * this.pageSize();
    return allData.slice(startIndex, startIndex + this.pageSize());
  });
  
  /**
   * Total number of pages
   */
  readonly totalPages = computed(() => {
    const allData = this.productsResource.value() || [];
    return Math.ceil(allData.length / this.pageSize());
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