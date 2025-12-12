import type { RawMockProduct, MockProductViewModel } from 'shared-types';
import { transformMockDataToViewModel, buildProductsByCategoryUrl, buildProductUrl, buildProductAdjacentUrl } from 'shared-types';

export interface ProductsResponse {
  products: MockProductViewModel[];
  total: number;
}

export const productService = {
  async getProductsByCategory(
    category: string,
    page: number,
    pageSize: number
  ): Promise<ProductsResponse> {
    const url = buildProductsByCategoryUrl(category, page, pageSize);
    const response = await fetch(url);
    const data = await response.json() as { products?: RawMockProduct[]; total?: number };

    if (data?.products) {
      return {
        products: data.products.map(transformMockDataToViewModel),
        total: data.total || 0,
      };
    }
    return { products: [], total: 0 };
  },

  async getProduct(code: string): Promise<MockProductViewModel | null> {
    const url = buildProductUrl(code);
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }
    const rawProduct = await response.json();
    return transformMockDataToViewModel(rawProduct);
  },

  async getAdjacentProducts(code: string): Promise<AdjacentProducts | null> {
    const url = buildProductAdjacentUrl(code);
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return response.json();
  },
};

export interface AdjacentProducts {
  previousId: string | null;
  nextId: string | null;
  currentIndex: number;
  total: number;
}
