import { ProductViewModel } from '../types/product.types.js';

export interface OpenFoodFactsProduct {
  // Core product info (100% reliable)
  code: string;
  categories: string;
  countries: string;
  ecoscore_grade: string;
  nova_groups_tags: string[];
  nutriscore_grade: string;
  nutrition_grades: string;
  
  // Basic info (80%+ reliable)
  product_name?: string;
  
  // Metadata (100% reliable)
  created_t: number;
  last_modified_t: number;
  completeness: number;
  scans_n: number;
  unique_scans_n: number;
  
  // Images (98%+ reliable)
  image_front_small_url?: string;
  image_front_url?: string;
  image_small_url?: string;
  image_url?: string;
  images?: any;
  // Nutrition data (85%+ reliable fields only)
  nutriments?: {
    // Energy values (85% reliable)
    'energy'?: number;
    'energy-kcal'?: number;
    'energy-kcal_100g'?: number;
    'energy-kcal_value'?: number;
    'energy-kcal_value_computed'?: number;
    'energy_100g'?: number;
    'energy_value'?: number;
    
    // Macronutrients (85% reliable)
    'carbohydrates'?: number;
    'carbohydrates_100g'?: number;
    'carbohydrates_value'?: number;
    'proteins'?: number;
    'proteins_100g'?: number;
    'proteins_value'?: number;
    'fat'?: number;
    'fat_100g'?: number;
    'fat_value'?: number;
    
    // Sugar and other nutrients (80% reliable)
    'sugars'?: number;
    'sugars_100g'?: number;
    'sugars_value'?: number;
    'saturated-fat'?: number;
    'saturated-fat_100g'?: number;
    'saturated-fat_value'?: number;
    'salt'?: number;
    'salt_100g'?: number;
    'salt_value'?: number;
    'sodium'?: number;
    'sodium_100g'?: number;
    'sodium_value'?: number;
    
    // Nutrition score
    'nutrition-score-fr'?: number;
    'nutrition-score-fr_100g'?: number;
  };
}

export function transformOpenFoodFactsToProductViewModel(offProduct: OpenFoodFactsProduct): ProductViewModel {
  // Helper function to extract NOVA group from tags
  const extractNovaGroup = (novaTags?: string[]): number | undefined => {
    if (!novaTags || !Array.isArray(novaTags)) return undefined;
    
    const novaTag = novaTags.find(tag => tag.match(/^en:\d-/));
    if (!novaTag) return undefined;
    
    const match = novaTag.match(/^en:(\d)-/);
    return match ? parseInt(match[1]) : undefined;
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
    // Core product information (100% reliable)
    code: offProduct.code,
    productName: offProduct.product_name || `Product ${offProduct.code}`,
    categories: offProduct.categories,
    countries: offProduct.countries,
    
    // Scores and grades (100% reliable)
    ecoGrade: offProduct.ecoscore_grade,
    nutritionGrade: offProduct.nutriscore_grade,
    nutritionGrades: offProduct.nutrition_grades,
    novaGroup: extractNovaGroup(offProduct.nova_groups_tags),
    
    // Metadata (100% reliable) 
    createdAt: new Date(offProduct.created_t * 1000),
    lastModifiedAt: new Date(offProduct.last_modified_t * 1000),
    completeness: Math.round(offProduct.completeness * 100),
    totalScans: offProduct.scans_n,
    uniqueScans: offProduct.unique_scans_n,
    
    // Images (98%+ reliable)
    images: {
      frontImageSmall: offProduct.image_front_small_url || offProduct.image_small_url,
      frontImageDisplay: offProduct.image_front_url || offProduct.image_url
    },
    
    // Nutrition data (only 85%+ reliable fields)
    nutrition: {
      // Energy values (85% reliable)
      energy: offProduct.nutriments?.energy,
      energyKcal: offProduct.nutriments?.['energy-kcal'],
      energyPer100g: offProduct.nutriments?.['energy-kcal_100g'] || offProduct.nutriments?.energy_100g,
      energyValue: offProduct.nutriments?.['energy-kcal_value'] || offProduct.nutriments?.energy_value,
      energyKcalValueComputed: offProduct.nutriments?.['energy-kcal_value_computed'],
      
      // Macronutrients (85% reliable)
      carbohydrates: offProduct.nutriments?.carbohydrates,
      carbohydratesPer100g: offProduct.nutriments?.carbohydrates_100g,
      carbohydratesValue: offProduct.nutriments?.carbohydrates_value,
      
      proteins: offProduct.nutriments?.proteins,
      proteinsPer100g: offProduct.nutriments?.proteins_100g,
      proteinsValue: offProduct.nutriments?.proteins_value,
      
      fat: offProduct.nutriments?.fat,
      fatPer100g: offProduct.nutriments?.fat_100g,
      fatValue: offProduct.nutriments?.fat_value,
      
      // Sugars and other nutrients (80% reliable)
      sugars: offProduct.nutriments?.sugars,
      sugarsPer100g: offProduct.nutriments?.sugars_100g,
      sugarsValue: offProduct.nutriments?.sugars_value,
      
      saturatedFat: offProduct.nutriments?.['saturated-fat'],
      saturatedFatPer100g: offProduct.nutriments?.['saturated-fat_100g'],
      saturatedFatValue: offProduct.nutriments?.['saturated-fat_value'],
      
      salt: offProduct.nutriments?.salt,
      saltPer100g: offProduct.nutriments?.salt_100g,
      saltValue: offProduct.nutriments?.salt_value,
      
      sodium: offProduct.nutriments?.sodium,
      sodiumPer100g: offProduct.nutriments?.sodium_100g,
      sodiumValue: offProduct.nutriments?.sodium_value,
      
      // Nutrition score
      nutritionScoreFr: offProduct.nutriments?.['nutrition-score-fr'],
      nutritionScoreFrPer100g: offProduct.nutriments?.['nutrition-score-fr_100g']
    }
  };
}