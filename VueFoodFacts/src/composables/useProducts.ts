import { onWatcherCleanup, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue';
import type { MockProductViewModel } from 'shared-types';
import { productService } from '../services/productService';

interface UseProductsParams {
  category?: MaybeRefOrGetter<string>;
  page?: MaybeRefOrGetter<number>;
  pageSize?: MaybeRefOrGetter<number>;
}

export const useProducts = ({ category = 'all', page = 1, pageSize = 50 }: UseProductsParams = {}) => {
  // API data is replaced wholesale and never mutated: shallowRef avoids deep proxies
  const products = shallowRef<MockProductViewModel[]>([]);
  const total = ref(0);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Previous data stays in place while the next page loads, keeping the table rendered
  watch(
    [() => toValue(category), () => toValue(page), () => toValue(pageSize)],
    async ([categoryValue, pageValue, pageSizeValue]) => {
      let cancelled = false;
      onWatcherCleanup(() => {
        cancelled = true;
      });

      loading.value = true;
      error.value = null;

      try {
        const data = await productService.getProductsByCategory(categoryValue, pageValue, pageSizeValue);

        if (!cancelled) {
          products.value = data.products;
          total.value = data.total;
        }
      } catch (err) {
        if (!cancelled) {
          error.value = err instanceof Error ? err.message : 'Failed to fetch products';
        }
      } finally {
        if (!cancelled) {
          loading.value = false;
        }
      }
    },
    { immediate: true }
  );

  return { products, total, loading, error };
};
