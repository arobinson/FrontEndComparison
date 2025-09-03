// OpenFoodFacts Product View Models with camelCase TypeScript conventions

export interface ProductViewModel {
  // Core identifiers (100% reliable)
  code: string;
  productName: string;
  categories: string;
  countries: string;
  
  // Scores and grades (100% reliable)
  ecoGrade: string;
  nutritionGrade: string;
  nutritionGrades: string;
  novaGroup?: number;
  
  // Timestamps (100% reliable)
  createdAt: Date;
  lastModifiedAt: Date;
  
  // Metadata (100% reliable)
  completeness: number;
  totalScans: number;
  uniqueScans: number;
  
  // Images (98%+ reliable)
  images: ImageViewModel;
  
  // Nutrition details (85%+ reliable fields only)
  nutrition: NutritionViewModel;
}

export interface NutritionViewModel {
  // Energy values (85% reliable)
  energy?: number;
  energyKcal?: number;
  energyPer100g?: number;
  energyValue?: number;
  energyKcalValueComputed?: number;
  
  // Macro-nutrients (85% reliable)
  carbohydrates?: number;
  carbohydratesPer100g?: number;
  carbohydratesValue?: number;
  
  proteins?: number;
  proteinsPer100g?: number;
  proteinsValue?: number;
  
  fat?: number;
  fatPer100g?: number;
  fatValue?: number;
  
  // Sugars and other nutrients (80% reliable)
  sugars?: number;
  sugarsPer100g?: number;
  sugarsValue?: number;
  
  saturatedFat?: number;
  saturatedFatPer100g?: number;
  saturatedFatValue?: number;
  
  salt?: number;
  saltPer100g?: number;
  saltValue?: number;
  
  sodium?: number;
  sodiumPer100g?: number;
  sodiumValue?: number;
  
  // Nutrition score
  nutritionScoreFr?: number;
  nutritionScoreFrPer100g?: number;
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

// DummyJSON API types
export interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
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
  scans_n?: number;
  ecoscore_grade?: string;
  nutriscore_grade?: string;
  nutrition_grades?: string;
  images?: any;
  nutriments?: any;
}