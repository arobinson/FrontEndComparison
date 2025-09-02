// OpenFoodFacts Product View Models with camelCase TypeScript conventions

export interface ProductViewModel {
  // Core identifiers
  code: string;
  productName?: string;
  genericName?: string;
  brands?: string;
  
  // Categories and origins
  categories?: string;
  origins?: string;
  manufacturingPlaces?: string;
  stores?: string;
  countries?: string;
  
  // Product details
  labels?: string;
  packaging?: string;
  quantity?: string;
  servingSize?: string;
  
  // Nutrition and health
  nutritionScore?: number;
  novaGroup?: number;
  ecoScore?: number;
  
  // Allergens and dietary
  allergens?: string;
  traces?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  palmOilFree?: boolean;
  
  // Timestamps
  createdAt?: Date;
  lastModifiedAt?: Date;
  
  // Images
  images: ImageViewModel;
  
  // Nutrition details
  nutrition: NutritionViewModel;
  
  // Additional data
  ingredients?: string;
  completeness?: number;
  uniqueScans?: number;
}

export interface NutritionViewModel {
  // Energy
  energyPer100g?: number;
  energyPerServing?: number;
  
  // Macro-nutrients
  proteinsPer100g?: number;
  carbohydratesPer100g?: number;
  fatPer100g?: number;
  sugarsPer100g?: number;
  fiberPer100g?: number;
  saturatedFatPer100g?: number;
  
  // Minerals and others
  sodiumPer100g?: number;
  saltPer100g?: number;
  cholesterolPer100g?: number;
  caffeinePer100g?: number;
}

export interface ImageViewModel {
  frontImageSmall?: string;
  frontImageDisplay?: string;
  ingredientsImageSmall?: string;
  ingredientsImageDisplay?: string;
  nutritionImageSmall?: string;
  nutritionImageDisplay?: string;
  packagingImageSmall?: string;
  packagingImageDisplay?: string;
}

export interface ApiResponse<T> {
  status: number;
  product?: T;
  products?: T[];
}

// Raw API types (snake_case from OpenFoodFacts)
export interface RawProduct {
  code: string;
  product_name?: string;
  generic_name?: string;
  brands?: string;
  categories?: string;
  origins?: string;
  manufacturing_places?: string;
  stores?: string;
  countries?: string;
  labels?: string;
  packaging?: string;
  quantity?: string;
  serving_size?: string;
  nutrition_score_fr?: number;
  nova_group?: number;
  ecoscore_score?: number;
  allergens?: string;
  traces?: string;
  vegetarian?: string;
  vegan?: string;
  palm_oil_free?: string;
  created_t?: number;
  last_modified_t?: number;
  ingredients_text?: string;
  completeness?: number;
  unique_scans_n?: number;
  images?: any;
  nutriments?: any;
}