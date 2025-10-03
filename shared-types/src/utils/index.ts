import { ProductViewModel, DummyJsonProduct } from '../types/product.types.js';

// API configuration - Using local Open Food Facts backend for fast, real product data
export const API_BASE_URL = 'http://localhost:3001/api';

// Re-export transformers
export * from './transformers.js';
export * from './open-food-facts-transformers.js';

export function filterProductsByCategory(products: ProductViewModel[], category?: string): ProductViewModel[] {
  if (!category || category === 'all') return products;

  return products.filter((product) => product.categories?.toLowerCase().includes(category.toLowerCase()));
}

export function searchProducts(products: ProductViewModel[], query: string): ProductViewModel[] {
  if (!query.trim()) return products;

  const searchTerm = query.toLowerCase();
  return products.filter(
    (product) => product.productName?.toLowerCase().includes(searchTerm) || product.categories?.toLowerCase().includes(searchTerm)
  );
}

// URL Builder utilities for local Open Food Facts API
export function buildProductsByCategoryUrl(category: string, page = 1, pageSize = 50): string {
  const skip = (page - 1) * pageSize;
  return `${API_BASE_URL}/products?category=${encodeURIComponent(category)}&limit=${pageSize}&skip=${skip}`;
}

export function buildProductUrl(code: string): string {
  return `${API_BASE_URL}/products/${code}`;
}

export function buildProductsSearchUrl(query: string, page = 1, pageSize = 50): string {
  const skip = (page - 1) * pageSize;
  return `${API_BASE_URL}/products?search=${encodeURIComponent(query)}&limit=${pageSize}&skip=${skip}`;
}

// DummyJSON API transformer
export function transformDummyJsonToProductViewModel(dummyProduct: DummyJsonProduct): ProductViewModel {
  const seedRandom = (seed: number, min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const seed = dummyProduct.id;
  const countries = ['France', 'Germany', 'Spain', 'Italy', 'USA', 'Canada', 'Japan', 'Brazil'];

  return {
    // Core identifiers (required)
    code: String(dummyProduct.id),
    productName: dummyProduct.title,
    categories: dummyProduct.category,
    countries: countries[seedRandom(seed + 6, 0, countries.length - 1)],

    // Scores and grades (required)
    ecoGrade: ['a', 'b', 'c', 'd', 'e'][seedRandom(seed + 10, 0, 4)],
    nutritionGrade: ['a', 'b', 'c', 'd', 'e'][seedRandom(seed + 11, 0, 4)],
    nutritionGrades: ['a', 'b', 'c', 'd', 'e'][seedRandom(seed + 12, 0, 4)],
    novaGroup: seedRandom(seed + 13, 1, 4),

    // Timestamps (required)
    createdAt: new Date(2020 + seedRandom(seed + 16, 0, 4), seedRandom(seed + 17, 0, 11), seedRandom(seed + 18, 1, 28)),
    lastModifiedAt: new Date(2023 + seedRandom(seed + 19, 0, 1), seedRandom(seed + 20, 0, 11), seedRandom(seed + 21, 1, 28)),

    // Metadata (required)
    completeness: seedRandom(seed + 49, 60, 100),
    totalScans: seedRandom(seed + 50, 100, 10000),
    uniqueScans: seedRandom(seed + 51, 50, 5000),
    images: {
      frontImageSmall: dummyProduct.thumbnail,
      frontImageDisplay: dummyProduct.images?.[0] || dummyProduct.thumbnail,
      ingredientsImageSmall: dummyProduct.images?.[1],
      ingredientsImageDisplay: dummyProduct.images?.[2],
      nutritionImageSmall: dummyProduct.images?.[3],
      nutritionImageDisplay: dummyProduct.images?.[4],
      packagingImageSmall: dummyProduct.images?.[5],
      packagingImageDisplay: dummyProduct.images?.[6]
    },
    nutrition: {
      // Energy values
      energy: seedRandom(seed + 22, 200, 2500),
      energyKcal: seedRandom(seed + 23, 50, 600),
      energyPer100g: seedRandom(seed + 24, 50, 600),
      energyValue: seedRandom(seed + 25, 50, 600),

      // Macro-nutrients
      carbohydrates: seedRandom(seed + 26, 5, 80),
      carbohydratesPer100g: seedRandom(seed + 27, 5, 80),
      carbohydratesValue: seedRandom(seed + 28, 5, 80),

      proteins: seedRandom(seed + 29, 1, 30),
      proteinsPer100g: seedRandom(seed + 30, 1, 30),
      proteinsValue: seedRandom(seed + 31, 1, 30),

      fat: seedRandom(seed + 32, 0, 40),
      fatPer100g: seedRandom(seed + 33, 0, 40),
      fatValue: seedRandom(seed + 34, 0, 40),

      // Other nutrients
      sugars: seedRandom(seed + 35, 0, 30),
      sugarsPer100g: seedRandom(seed + 36, 0, 30),
      sugarsValue: seedRandom(seed + 37, 0, 30),

      saturatedFat: seedRandom(seed + 38, 0, 15),
      saturatedFatPer100g: seedRandom(seed + 39, 0, 15),
      saturatedFatValue: seedRandom(seed + 40, 0, 15),

      salt: seedRandom(seed + 41, 0, 5),
      saltPer100g: seedRandom(seed + 42, 0, 5),
      saltValue: seedRandom(seed + 43, 0, 5),

      sodium: seedRandom(seed + 44, 0, 2000),
      sodiumPer100g: seedRandom(seed + 45, 0, 2000),
      sodiumValue: seedRandom(seed + 46, 0, 2000),

      // Nutrition score
      nutritionScoreFr: seedRandom(seed + 47, 0, 40),
      nutritionScoreFrPer100g: seedRandom(seed + 48, 0, 40)
    }
  };
}

// Utility functions
export function formatProductName(name?: string): string {
  let result = '';
  if (name) {
    result = name.trim();
  } else {
    result = 'Unknown Product';
  }
  return result;
}
