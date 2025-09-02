// API configuration
export const API_BASE_URL = 'https://world.openfoodfacts.org/api/v0';

// Re-export transformers
export * from './transformers.js';

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