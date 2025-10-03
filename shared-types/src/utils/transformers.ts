import { ProductViewModel, NutritionViewModel, ImageViewModel, RawProduct } from '../types/product.types.js';

/**
 * Transform raw OpenFoodFacts API response (snake_case) to camelCase view model
 * Updated to match reliable fields from OpenFoodFacts API
 */
export function transformToProductViewModel(raw: RawProduct): ProductViewModel {
  let result: ProductViewModel;

  result = {
    // Core identifiers (required)
    code: raw.code,
    productName: raw.product_name || `Product ${raw.code}`,
    categories: raw.categories || 'Unknown',
    countries: raw.countries || 'Unknown',

    // Scores and grades (required)
    ecoGrade: raw.ecoscore_grade || 'unknown',
    nutritionGrade: raw.nutriscore_grade || 'unknown',
    nutritionGrades: raw.nutrition_grades || 'unknown',
    novaGroup: raw.nova_group,

    // Timestamps (required)
    createdAt: raw.created_t ? new Date(raw.created_t * 1000) : new Date(),
    lastModifiedAt: raw.last_modified_t ? new Date(raw.last_modified_t * 1000) : new Date(),

    // Metadata (required)
    completeness: raw.completeness ? Math.round(raw.completeness * 100) : 0,
    totalScans: raw.scans_n || 0,
    uniqueScans: raw.unique_scans_n || 0,

    // Nested objects
    images: transformToImageViewModel(raw.images),
    nutrition: transformToNutritionViewModel(raw.nutriments)
  };

  return result;
}

/**
 * Transform raw nutrition data to camelCase view model
 * Updated to match reliable nutrition fields from OpenFoodFacts API
 */
function transformToNutritionViewModel(rawNutriments: any): NutritionViewModel {
  let result: NutritionViewModel;

  if (!rawNutriments) {
    result = {};
  } else {
    result = {
      // Energy values (85% reliable)
      energy: rawNutriments['energy'],
      energyKcal: rawNutriments['energy-kcal'],
      energyPer100g: rawNutriments['energy-kcal_100g'] || rawNutriments['energy_100g'],
      energyValue: rawNutriments['energy-kcal_value'] || rawNutriments['energy_value'],
      energyKcalValueComputed: rawNutriments['energy-kcal_value_computed'],

      // Macro-nutrients (85% reliable)
      carbohydrates: rawNutriments['carbohydrates'],
      carbohydratesPer100g: rawNutriments['carbohydrates_100g'],
      carbohydratesValue: rawNutriments['carbohydrates_value'],

      proteins: rawNutriments['proteins'],
      proteinsPer100g: rawNutriments['proteins_100g'],
      proteinsValue: rawNutriments['proteins_value'],

      fat: rawNutriments['fat'],
      fatPer100g: rawNutriments['fat_100g'],
      fatValue: rawNutriments['fat_value'],

      // Sugars and other nutrients (80% reliable)
      sugars: rawNutriments['sugars'],
      sugarsPer100g: rawNutriments['sugars_100g'],
      sugarsValue: rawNutriments['sugars_value'],

      saturatedFat: rawNutriments['saturated-fat'],
      saturatedFatPer100g: rawNutriments['saturated-fat_100g'],
      saturatedFatValue: rawNutriments['saturated-fat_value'],

      salt: rawNutriments['salt'],
      saltPer100g: rawNutriments['salt_100g'],
      saltValue: rawNutriments['salt_value'],

      sodium: rawNutriments['sodium'],
      sodiumPer100g: rawNutriments['sodium_100g'],
      sodiumValue: rawNutriments['sodium_value'],

      // Nutrition score
      nutritionScoreFr: rawNutriments['nutrition-score-fr'],
      nutritionScoreFrPer100g: rawNutriments['nutrition-score-fr_100g']
    };
  }

  return result;
}

/**
 * Transform raw image data to camelCase view model
 */
function transformToImageViewModel(rawImages: any): ImageViewModel {
  let result: ImageViewModel;

  if (!rawImages) {
    result = {};
  } else {
    result = {
      frontImageSmall: rawImages?.front?.small?.url,
      frontImageDisplay: rawImages?.front?.display?.url,
      ingredientsImageSmall: rawImages?.ingredients?.small?.url,
      ingredientsImageDisplay: rawImages?.ingredients?.display?.url,
      nutritionImageSmall: rawImages?.nutrition?.small?.url,
      nutritionImageDisplay: rawImages?.nutrition?.display?.url,
      packagingImageSmall: rawImages?.packaging?.small?.url,
      packagingImageDisplay: rawImages?.packaging?.display?.url
    };
  }

  return result;
}

/**
 * Parse boolean string values from OpenFoodFacts API
 */
function parseBooleanString(value?: string): boolean | undefined {
  let result: boolean | undefined;

  if (!value) {
    result = undefined;
  } else if (value === 'yes' || value === '1' || value === 'true') {
    result = true;
  } else if (value === 'no' || value === '0' || value === 'false') {
    result = false;
  } else {
    result = undefined;
  }

  return result;
}
