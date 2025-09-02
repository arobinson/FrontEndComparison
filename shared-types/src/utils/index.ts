import { ProductViewModel, DummyJsonProduct } from '../types/product.types.js';

// API configuration - Using local Open Food Facts backend for fast, real product data
export const API_BASE_URL = 'http://localhost:3001/api';

// Re-export transformers
export * from './transformers.js';
export * from './open-food-facts-transformers.js';

// Local Open Food Facts data
export async function loadLocalOpenFoodFactsData(): Promise<ProductViewModel[]> {
  try {
    // In browser environment, we'll need to fetch from a local server or static file
    // For now, return empty array - this will be implemented when we add a local server
    return [];
  } catch {
    return [];
  }
}

export function filterProductsByCategory(products: ProductViewModel[], category?: string): ProductViewModel[] {
  if (!category || category === 'all') return products;
  
  return products.filter(product => 
    product.categories?.toLowerCase().includes(category.toLowerCase())
  );
}

export function searchProducts(products: ProductViewModel[], query: string): ProductViewModel[] {
  if (!query.trim()) return products;
  
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.productName?.toLowerCase().includes(searchTerm) ||
    product.brands?.toLowerCase().includes(searchTerm) ||
    product.categories?.toLowerCase().includes(searchTerm)
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
  const isVegetarian = seedRandom(seed + 1, 0, 1) === 1;
  const isVegan = isVegetarian && seedRandom(seed + 2, 0, 1) === 1;
  
  const countries = ['France', 'Germany', 'Spain', 'Italy', 'USA', 'Canada', 'Japan', 'Brazil'];
  const origins = ['Organic Farm Valley', 'Mountain Springs', 'Coastal Farms', 'Prairie Fields', 'Highland Orchards'];
  const allergensList = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Fish', 'Shellfish', 'Sesame'];
  const stores = ['Walmart', 'Target', 'Whole Foods', 'Kroger', 'Safeway', 'Costco'];
  
  return {
    code: String(dummyProduct.id),
    productName: dummyProduct.title,
    genericName: `Generic ${dummyProduct.category}`,
    brands: dummyProduct.brand,
    categories: dummyProduct.category,
    origins: origins[seedRandom(seed + 3, 0, origins.length - 1)],
    manufacturingPlaces: `${countries[seedRandom(seed + 4, 0, countries.length - 1)]} Factory`,
    stores: stores[seedRandom(seed + 5, 0, stores.length - 1)],
    countries: countries[seedRandom(seed + 6, 0, countries.length - 1)],
    labels: `Certified ${isVegan ? 'Vegan' : isVegetarian ? 'Vegetarian' : 'Quality'}`,
    packaging: `${seedRandom(seed + 7, 100, 500)}g Box`,
    quantity: `${seedRandom(seed + 8, 200, 1000)}g`,
    servingSize: `${seedRandom(seed + 9, 20, 100)}g`,
    nutritionScore: Math.floor(dummyProduct.rating),
    novaGroup: seedRandom(seed + 10, 1, 4),
    ecoScore: Math.floor(dummyProduct.rating * 20),
    allergens: seedRandom(seed + 11, 0, 1) ? allergensList[seedRandom(seed + 12, 0, allergensList.length - 1)] : undefined,
    traces: seedRandom(seed + 13, 0, 1) ? `May contain ${allergensList[seedRandom(seed + 14, 0, allergensList.length - 1)]}` : undefined,
    vegetarian: isVegetarian,
    vegan: isVegan,
    palmOilFree: seedRandom(seed + 15, 0, 1) === 1,
    createdAt: new Date(2020 + seedRandom(seed + 16, 0, 4), seedRandom(seed + 17, 0, 11), seedRandom(seed + 18, 1, 28)),
    lastModifiedAt: new Date(2023 + seedRandom(seed + 19, 0, 1), seedRandom(seed + 20, 0, 11), seedRandom(seed + 21, 1, 28)),
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
      energyPer100g: seedRandom(seed + 22, 50, 500),
      energyPerServing: seedRandom(seed + 23, 20, 200),
      proteinsPer100g: seedRandom(seed + 24, 1, 30),
      carbohydratesPer100g: seedRandom(seed + 25, 5, 80),
      fatPer100g: seedRandom(seed + 26, 0, 40),
      sugarsPer100g: seedRandom(seed + 27, 0, 30),
      fiberPer100g: seedRandom(seed + 28, 0, 15),
      saturatedFatPer100g: seedRandom(seed + 29, 0, 15),
      sodiumPer100g: seedRandom(seed + 30, 0, 2000),
      saltPer100g: seedRandom(seed + 31, 0, 5),
      cholesterolPer100g: seedRandom(seed + 32, 0, 100),
      caffeinePer100g: seedRandom(seed + 33, 0, 200)
    },
    ingredients: `Water, ${dummyProduct.category.toLowerCase()}, Natural flavors, Preservatives`,
    completeness: seedRandom(seed + 34, 60, 100),
    uniqueScans: seedRandom(seed + 35, 100, 10000)
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