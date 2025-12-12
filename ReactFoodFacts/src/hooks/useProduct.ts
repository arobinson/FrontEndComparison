import { useState, useEffect, useRef } from 'react';
import type { MockProductViewModel } from 'shared-types';
import { productService, type AdjacentProducts } from '../services/productService';

interface UseProductResult {
  product: MockProductViewModel | null;
  loading: boolean;
  error: string | null;
  adjacent: AdjacentProducts | null;
  refetch: () => void;
}

export const useProduct = (code: string): UseProductResult => {
  const [product, setProduct] = useState<MockProductViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adjacent, setAdjacent] = useState<AdjacentProducts | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Keep reference to previous product to preserve during loading
  const previousProductRef = useRef<MockProductViewModel | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productData, adjacentData] = await Promise.all([
          productService.getProduct(code),
          productService.getAdjacentProducts(code),
        ]);

        if (!cancelled) {
          if (productData) {
            setProduct(productData);
            previousProductRef.current = productData;
          } else {
            setError('Product not found');
          }
          setAdjacent(adjacentData);
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

  // Return previous product during loading to prevent UI destruction
  const displayProduct = product ?? previousProductRef.current;

  return { product: displayProduct, loading, error, adjacent, refetch };
};
