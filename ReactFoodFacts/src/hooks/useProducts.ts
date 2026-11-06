import { useState, useEffect } from 'react';
import type { MockProductViewModel } from 'shared-types';
import { productService } from '../services/productService';

interface UseProductsParams {
  category?: string;
  page?: number;
  pageSize?: number;
}

interface UseProductsResult {
  products: MockProductViewModel[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducts = ({
  category = 'all',
  page = 1,
  pageSize = 50
}: UseProductsParams = {}): UseProductsResult => {
  const [products, setProducts] = useState<MockProductViewModel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Legitimate effect: synchronizes with the network (data fetching), React's documented
  // no-framework pattern (custom hook + ignore flag). Router loaders are deliberately not
  // used: they would hold the old route until data resolves and change the loading UI.
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // No `finally`: React Compiler cannot compile try/finally; the line after try/catch
      // runs on both paths, same as before.
      try {
        const data = await productService.getProductsByCategory(category, page, pageSize);

        if (!cancelled) {
          setProducts(data.products);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
        }
      }
      if (!cancelled) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [category, page, pageSize, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  // products/total are only replaced when a fetch succeeds, so the previous page's
  // data stays rendered while the next page loads.
  return { products, total, loading, error, refetch };
};
