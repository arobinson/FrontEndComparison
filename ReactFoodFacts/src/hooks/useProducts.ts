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

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      let result;
      try {
        const data = await productService.getProductsByCategory(category, page, pageSize);
        
        if (!cancelled) {
          setProducts(data.products);
          setTotal(data.total);
        }
        result = undefined;
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
        }
        result = undefined;
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
      return result;
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [category, page, pageSize, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { products, total, loading, error, refetch };
};
