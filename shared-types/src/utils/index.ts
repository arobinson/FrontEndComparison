import { ProductViewModel, DummyJsonProduct } from '../types/product.types.js';

// API configuration - Using DummyJSON for fast, realistic product data
export const API_BASE_URL = 'https://dummyjson.com';

// Re-export transformers
export * from './transformers.js';

// URL Builder utilities for DummyJSON API
export function buildProductsByCategoryUrl(category: string, page = 1, pageSize = 20): string {
  const skip = (page - 1) * pageSize;
  if (category === 'beverages') {
    // Map beverages to a category that exists in DummyJSON
    return `${API_BASE_URL}/products/category/groceries?limit=${pageSize}&skip=${skip}`;
  }
  return `${API_BASE_URL}/products?limit=${pageSize}&skip=${skip}`;
}

export function buildProductUrl(code: string): string {
  return `${API_BASE_URL}/products/${code}`;
}

export function buildProductsSearchUrl(query: string, page = 1, pageSize = 20): string {
  const skip = (page - 1) * pageSize;
  return `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${pageSize}&skip=${skip}`;
}

// DummyJSON API transformer
export function transformDummyJsonToProductViewModel(dummyProduct: DummyJsonProduct): ProductViewModel {
  return {
    code: String(dummyProduct.id),
    productName: dummyProduct.title,
    brands: dummyProduct.brand,
    categories: dummyProduct.category,
    nutritionScore: Math.floor(dummyProduct.rating),
    novaGroup: Math.floor(Math.random() * 4) + 1,
    ecoScore: Math.floor(dummyProduct.rating * 20),
    images: {
      frontImageSmall: dummyProduct.thumbnail,
      frontImageDisplay: dummyProduct.images?.[0] || dummyProduct.thumbnail
    },
    nutrition: {
      energyPer100g: Math.floor(Math.random() * 500),
      proteinsPer100g: Math.floor(Math.random() * 30),
      carbohydratesPer100g: Math.floor(Math.random() * 80),
      fatPer100g: Math.floor(Math.random() * 40)
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