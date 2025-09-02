import { ProductViewModel } from '../types/product.types.js';

export interface OpenFoodFactsProduct {
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
  ingredients_n?: number;
  unknown_ingredients_n?: number;
  additives_n?: number;
  ecoscore_grade?: string;
  nutriscore_grade?: string;
  nutriscore_score?: number;
  purchase_places?: string;
  main_category?: string;
  image_thumb_url?: string;
  image_small_url?: string;
  image_url?: string;
  images?: any;
  image_front_small_url?: string;
  image_front_url?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kcal_serving'?: number;
    'proteins_100g'?: number;
    'carbohydrates_100g'?: number;
    'fat_100g'?: number;
    'sugars_100g'?: number;
    'fiber_100g'?: number;
    'saturated-fat_100g'?: number;
    'sodium_100g'?: number;
    'salt_100g'?: number;
    'cholesterol_100g'?: number;
    'caffeine_100g'?: number;
  };
}

export function transformOpenFoodFactsToProductViewModel(offProduct: OpenFoodFactsProduct): ProductViewModel {
  // Helper function to parse boolean strings from OpenFoodFacts
  const parseBoolean = (value?: string): boolean => {
    return value === '1' || value === 'yes' || value === 'true';
  };

  // Generate working image URLs from Open Food Facts image structure
  const getFrontImageUrl = (size: 'small' | 'display' = 'small'): string | undefined => {
    // First try direct URL fields if available
    if (size === 'small' && offProduct.image_front_small_url) {
      return offProduct.image_front_small_url;
    }
    if (size === 'display' && offProduct.image_front_url) {
      return offProduct.image_front_url;
    }

    // Fallback: construct URL from image structure
    try {
      const images = offProduct.images;
      if (!images?.selected?.front) return undefined;
      
      // Try common languages
      const languages = ['en', 'fr', 'es', 'de'];
      for (const lang of languages) {
        const imgData = images.selected.front[lang];
        if (imgData?.imgid) {
          const baseUrl = 'https://images.openfoodfacts.org/images/products';
          const code = offProduct.code;
          
          // Format EAN-13 barcode: 6111035000430 -> 611/103/500/0430
          let formattedCode;
          if (code.length === 13) {
            // EAN-13: 3 + 3 + 3 + 4 pattern
            formattedCode = `${code.slice(0, 3)}/${code.slice(3, 6)}/${code.slice(6, 9)}/${code.slice(9, 13)}`;
          } else {
            // For other lengths, use 3-digit groups
            const groups = code.match(/.{1,3}/g) || [code];
            formattedCode = groups.join('/');
          }
          
          const imageSize = size === 'small' ? '200' : '400';
          return `${baseUrl}/${formattedCode}/front_${lang}.${imgData.imgid}.${imageSize}.jpg`;
        }
      }
    } catch {
      // Ignore errors
    }
    
    return undefined;
  };

  return {
    code: offProduct.code,
    productName: offProduct.product_name || undefined,
    genericName: offProduct.generic_name || undefined,
    brands: offProduct.brands || undefined,
    categories: offProduct.categories || undefined,
    origins: offProduct.origins || undefined,
    manufacturingPlaces: offProduct.manufacturing_places || undefined,
    stores: offProduct.stores || undefined,
    countries: offProduct.countries || undefined,
    labels: offProduct.labels || undefined,
    packaging: offProduct.packaging || undefined,
    quantity: offProduct.quantity || undefined,
    servingSize: offProduct.serving_size || undefined,
    nutritionScore: offProduct.nutrition_score_fr || undefined,
    novaGroup: offProduct.nova_group || undefined,
    ecoScore: offProduct.ecoscore_score || undefined,
    allergens: offProduct.allergens || undefined,
    traces: offProduct.traces || undefined,
    vegetarian: parseBoolean(offProduct.vegetarian),
    vegan: parseBoolean(offProduct.vegan),
    palmOilFree: parseBoolean(offProduct.palm_oil_free),
    createdAt: offProduct.created_t ? new Date(offProduct.created_t * 1000) : undefined,
    lastModifiedAt: offProduct.last_modified_t ? new Date(offProduct.last_modified_t * 1000) : undefined,
    ingredients: offProduct.ingredients_text || undefined,
    completeness: offProduct.completeness ? Math.round(offProduct.completeness * 100) : undefined,
    uniqueScans: offProduct.unique_scans_n || undefined,
    
    // Single-value metrics for performance testing
    totalScans: offProduct.scans_n || undefined,
    ingredientsCount: offProduct.ingredients_n || undefined,
    unknownIngredientsCount: offProduct.unknown_ingredients_n || undefined,
    additivesCount: offProduct.additives_n || undefined,
    ecoGrade: offProduct.ecoscore_grade || undefined,
    nutritionGrade: offProduct.nutriscore_grade || undefined,
    nutritionScoreValue: offProduct.nutriscore_score || undefined,
    purchasePlaces: offProduct.purchase_places || undefined,
    mainCategory: offProduct.main_category || undefined,
    images: {
      frontImageSmall: getFrontImageUrl('small'),
      frontImageDisplay: getFrontImageUrl('display')
    },
    nutrition: {
      energyPer100g: offProduct.nutriments?.['energy-kcal_100g'],
      energyPerServing: offProduct.nutriments?.['energy-kcal_serving'],
      proteinsPer100g: offProduct.nutriments?.['proteins_100g'],
      carbohydratesPer100g: offProduct.nutriments?.['carbohydrates_100g'],
      fatPer100g: offProduct.nutriments?.['fat_100g'],
      sugarsPer100g: offProduct.nutriments?.['sugars_100g'],
      fiberPer100g: offProduct.nutriments?.['fiber_100g'],
      saturatedFatPer100g: offProduct.nutriments?.['saturated-fat_100g'],
      sodiumPer100g: offProduct.nutriments?.['sodium_100g'],
      saltPer100g: offProduct.nutriments?.['salt_100g'],
      cholesterolPer100g: offProduct.nutriments?.['cholesterol_100g'],
      caffeinePer100g: offProduct.nutriments?.['caffeine_100g']
    }
  };
}