// Placeholder for OpenFoodFacts types
export interface Product {
  // Will be populated with OpenFoodFacts API structure
  code: string;
  product_name?: string;
  brands?: string;
  // ... more fields to be added
}

export interface ApiResponse<T> {
  status: number;
  product?: T;
  products?: T[];
}