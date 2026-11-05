import { onWatcherCleanup, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';
import type { MockProductViewModel } from 'shared-types';
import { productService, type AdjacentProducts } from '../services/productService';

export const useProduct = (code: MaybeRefOrGetter<string>) => {
  // API data is replaced wholesale and never mutated: shallowRef avoids deep proxies.
  // The previous product stays in place while the next one loads, preventing UI destruction.
  const product = shallowRef<MockProductViewModel | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const adjacent = shallowRef<AdjacentProducts | null>(null);

  watch(
    () => toValue(code),
    async (codeValue) => {
      let cancelled = false;
      onWatcherCleanup(() => {
        cancelled = true;
      });

      loading.value = true;
      error.value = null;

      try {
        const [productData, adjacentData] = await Promise.all([
          productService.getProduct(codeValue),
          productService.getAdjacentProducts(codeValue),
        ]);

        if (!cancelled) {
          if (productData) {
            product.value = productData;
          } else {
            error.value = 'Product not found';
          }
          adjacent.value = adjacentData;
        }
      } catch (err) {
        if (!cancelled) {
          error.value = err instanceof Error ? err.message : 'Failed to fetch product';
        }
      } finally {
        if (!cancelled) {
          loading.value = false;
        }
      }
    },
    { immediate: true }
  );

  return { product, loading, error, adjacent };
};
