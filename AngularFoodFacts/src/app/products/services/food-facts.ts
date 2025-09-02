import { Injectable, resource, signal, Signal } from '@angular/core';
import {
  ProductViewModel,
  buildProductsByCategoryUrl,
  buildProductUrl,
  buildProductsSearchUrl,
  transformDummyJsonToProductViewModel,
} from 'shared-types';

@Injectable({
  providedIn: 'root',
})
export class FoodFacts {
  /**
   * Create a resource for products by category
   */
  createProductsByCategoryResource(
    category: Signal<string>,
    page = signal(1),
    pageSize = signal(20),
  ) {
    return resource({
      loader: async () => {
        const url = buildProductsByCategoryUrl(category(), page(), pageSize());
        const response = await fetch(url);
        const data = (await response.json()) as { products?: any[] };

        let products: ProductViewModel[];
        if (data?.products) {
          products = data.products.map(transformDummyJsonToProductViewModel);
        } else {
          products = [];
        }
        return products;
      },
    });
  }

  /**
   * Create a resource for a specific product by code
   */
  createProductResource(code: Signal<string>) {
    return resource({
      loader: async () => {
        const url = buildProductUrl(code());
        const response = await fetch(url);
        const data = await response.json();

        let product: ProductViewModel | null;
        if (data) {
          product = transformDummyJsonToProductViewModel(data);
        } else {
          product = null;
        }
        return product;
      },
    });
  }

  /**
   * Create a resource for products by search query
   */
  createProductsSearchResource(
    query: Signal<string>,
    page = signal(1),
    pageSize = signal(20),
  ) {
    return resource({
      loader: async () => {
        const url = buildProductsSearchUrl(query(), page(), pageSize());
        const response = await fetch(url);
        const data = (await response.json()) as { products?: any[] };

        let products: ProductViewModel[];
        if (data?.products) {
          products = data.products.map(transformDummyJsonToProductViewModel);
        } else {
          products = [];
        }
        return products;
      },
    });
  }
}
