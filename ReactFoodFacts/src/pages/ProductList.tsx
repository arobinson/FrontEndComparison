import { useProducts } from '../hooks/useProducts';
import { ProgressBar } from '../components/display/ProgressBar';

const ProductList = () => {
  const { products, total, loading, error } = useProducts({
    category: 'all',
    page: 1,
    pageSize: 50,
  });

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Product List (React)</h1>
      <p>Found {total} total products (showing {products.length})</p>

      <h2>Progress Bar Test:</h2>
      <ProgressBar value={75} />
      <ProgressBar value={45} />
      <ProgressBar value={25} />

      <h2>Products:</h2>
      <ul>
        {products.slice(0, 5).map((product) => (
          <li key={product.code}>
            {product.productName} - {product.brand}
            {product.qualityScore && (
              <>
                {' - Quality: '}
                <ProgressBar value={product.qualityScore} />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
