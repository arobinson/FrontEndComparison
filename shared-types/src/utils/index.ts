// Placeholder for shared utilities
export const API_BASE_URL = 'https://world.openfoodfacts.org/api/v0';

export function formatProductName(name?: string): string {
  let result = '';
  if (name) {
    result = name.trim();
  } else {
    result = 'Unknown Product';
  }
  return result;
}