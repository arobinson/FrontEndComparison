import { useState, useEffect } from 'react';
import type { MockProductViewModel } from 'shared-types';
import { productService } from '../services/productService';

interface UseProductResult {
  product: MockProductViewModel | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProduct = (code: string): UseProductResult => {
  const [product, setProduct] = useState<MockProductViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await productService.getProduct(code);

        if (!cancelled) {
          setProduct(data);
          if (!data) {
            setError('Product not found');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch product');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [code, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { product, loading, error, refetch };
};
