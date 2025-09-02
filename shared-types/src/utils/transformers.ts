import { ProductViewModel, NutritionViewModel, ImageViewModel, RawProduct } from '../types/product.types.js';

/**
 * Transform raw OpenFoodFacts API response (snake_case) to camelCase view model
 */
export function transformToProductViewModel(raw: RawProduct): ProductViewModel {
  let result: ProductViewModel;

  // Transform basic properties
  const basicProps = {
    code: raw.code,
    productName: raw.product_name,
    genericName: raw.generic_name,
    brands: raw.brands,
    categories: raw.categories,
    origins: raw.origins,
    manufacturingPlaces: raw.manufacturing_places,
    stores: raw.stores,
    countries: raw.countries,
    labels: raw.labels,
    packaging: raw.packaging,
    quantity: raw.quantity,
    servingSize: raw.serving_size,
    nutritionScore: raw.nutrition_score_fr,
    novaGroup: raw.nova_group,
    ecoScore: raw.ecoscore_score,
    allergens: raw.allergens,
    traces: raw.traces,
    ingredients: raw.ingredients_text,
    completeness: raw.completeness,
    uniqueScans: raw.unique_scans_n
  };

  // Transform boolean fields
  const booleanProps = {
    vegetarian: parseBooleanString(raw.vegetarian),
    vegan: parseBooleanString(raw.vegan),
    palmOilFree: parseBooleanString(raw.palm_oil_free)
  };

  // Transform timestamps
  const dateProps = {
    createdAt: raw.created_t ? new Date(raw.created_t * 1000) : undefined,
    lastModifiedAt: raw.last_modified_t ? new Date(raw.last_modified_t * 1000) : undefined
  };

  // Transform nested objects
  const nestedProps = {
    images: transformToImageViewModel(raw.images),
    nutrition: transformToNutritionViewModel(raw.nutriments)
  };

  result = {
    ...basicProps,
    ...booleanProps,
    ...dateProps,
    ...nestedProps
  };

  return result;
}

/**
 * Transform raw nutrition data to camelCase view model
 */
function transformToNutritionViewModel(rawNutriments: any): NutritionViewModel {
  let result: NutritionViewModel;

  if (!rawNutriments) {
    result = {};
  } else {
    result = {
      energyPer100g: rawNutriments['energy_100g'],
      energyPerServing: rawNutriments['energy_serving'],
      proteinsPer100g: rawNutriments['proteins_100g'],
      carbohydratesPer100g: rawNutriments['carbohydrates_100g'],
      fatPer100g: rawNutriments['fat_100g'],
      sugarsPer100g: rawNutriments['sugars_100g'],
      fiberPer100g: rawNutriments['fiber_100g'],
      saturatedFatPer100g: rawNutriments['saturated-fat_100g'],
      sodiumPer100g: rawNutriments['sodium_100g'],
      saltPer100g: rawNutriments['salt_100g'],
      cholesterolPer100g: rawNutriments['cholesterol_100g'],
      caffeinePer100g: rawNutriments['caffeine_100g']
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