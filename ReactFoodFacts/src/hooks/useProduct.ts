import { useState, useEffect } from 'react';
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
        const [productData, adjacentData] = await Promise.all([
          productService.getProduct(code),
          productService.getAdjacentProducts(code),
        ]);

        if (!cancelled) {
          if (productData) {
            setProduct(productData);
          } else {
            setError('Product not found');
          }
          setAdjacent(adjacentData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch product');
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
  }, [code, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  // product is only replaced when a fetch succeeds, so the previous product stays
  // rendered while the next one loads.
  return { product, loading, error, adjacent, refetch };
};
