import { Injectable, resource, signal, Signal } from '@angular/core';
import {
  buildProductsByCategoryUrl,
  buildProductUrl,
  buildProductsSearchUrl,
  buildProductAdjacentUrl,
  RawMockProduct,
  MockProductViewModel,
  transformMockDataToViewModel,
} from 'shared-types';

export interface AdjacentProducts {
  previousId: string | null;
  nextId: string | null;
  currentIndex: number;
  total: number;
}

/**
 * Export types from shared-types for use in Angular components
 */
export type { MockProductViewModel as ProductViewModel };

@Injectable({
  providedIn: 'root',
})
export class FoodFacts {
  /**
   * Create a resource for products by category
   */
  createProductsByCategoryResource(
    category: Signal<string>,
    page: Signal<number>,
    pageSize: Signal<number>,
  ) {
    return resource({
      params: () => ({
        category: category(),
        page: page(),
        pageSize: pageSize(),
      }),
      loader: async ({ params }) => {
        const url = buildProductsByCategoryUrl(
          params.category,
          params.page,
          params.pageSize,
        );
        const response = await fetch(url);
        const data = (await response.json()) as {
          products?: RawMockProduct[];
          total?: number;
        };

        let result;
        // Transform raw mock data to ProductViewModel on client side
        if (data?.products) {
          result = {
            products: data.products.map(transformMockDataToViewModel),
            total: data.total || 0,
          };
        } else {
          result = {
            products: [],
            total: 0,
          };
        }
        return result;
      },
    });
  }

  /**
   * Create a resource for a specific product by code
   */
  createProductResource(code: Signal<string>) {
    return resource({
      params: () => ({ code: code() }),
      loader: async ({ params }) => {
        const url = buildProductUrl(params.code);
        const response = await fetch(url);

        let result;
        if (!response.ok) {
          result = null;
        } else {
          const rawProduct = await response.json();
          result = transformMockDataToViewModel(rawProduct);
        }
        return result;
      },
    });
  }

  /**
   * Create a resource for products by search query
   */
  createProductsSearchResource(
    query: Signal<string>,
    page = signal(1),
    pageSize = signal(50),
  ) {
    return resource({
      loader: async () => {
        const url = buildProductsSearchUrl(query(), page(), pageSize());
        const response = await fetch(url);
        const data = (await response.json()) as {
          products?: MockProductViewModel[];
        };

        // Local backend already returns transformed ProductViewModel objects
        return data?.products || [];
      },
    });
  }

  /**
   * Create a resource for adjacent product IDs (for next/previous navigation)
   */
  createAdjacentProductsResource(code: Signal<string>) {
    return resource({
      params: () => ({ code: code() }),
      loader: async ({ params }) => {
        const url = buildProductAdjacentUrl(params.code);
        const response = await fetch(url);

        let result: AdjacentProducts | null;
        if (!response.ok) {
          result = null;
        } else {
          result = await response.json();
        }
        return result;
      },
    });
  }
}
