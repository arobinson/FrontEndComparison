import { Injectable, resource, signal, Signal } from '@angular/core';
import {
  ProductViewModel,
  buildProductsByCategoryUrl,
  buildProductUrl,
  buildProductsSearchUrl,
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
    pageSize = signal(50),
  ) {
    return resource({
      loader: async () => {
        const url = buildProductsByCategoryUrl(category(), page(), pageSize());
        const response = await fetch(url);
        const data = (await response.json()) as { products?: ProductViewModel[] };

        // Local backend returns transformed ProductViewModel objects
        return data?.products || [];
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
        
        if (!response.ok) {
          return null;
        }
        
        // Local backend already returns transformed ProductViewModel object
        return (await response.json()) as ProductViewModel;
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
        const data = (await response.json()) as { products?: ProductViewModel[] };

        // Local backend already returns transformed ProductViewModel objects
        return data?.products || [];
      },
    });
  }
}
