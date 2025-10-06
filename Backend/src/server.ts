import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join } from 'path';

const app = express();
const PORT = 3001;

// Enable CORS for frontend apps
app.use(cors());
app.use(express.json());

// Load the Mock data
let productsData: any[];
try {
  const dataPath = join(process.cwd(), '..', 'shared-data', 'MOCK_DATA.json');
  productsData = JSON.parse(readFileSync(dataPath, 'utf-8'));
  console.log(`📊 Loaded ${productsData.length} mock products`);
} catch (error) {
  console.error('❌ Failed to load Mock data:', error);
  process.exit(1);
}

// API Routes
app.get('/api/products', (req, res) => {
  const { category, limit = '50', skip = '0', search } = req.query;

  let filteredProducts = productsData;

  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter((product: any) =>
      product.category?.toLowerCase().includes((category as string).toLowerCase())
    );
  }

  // Search filter
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product: any) => product.product_name?.toLowerCase().includes(searchTerm) || product.category?.toLowerCase().includes(searchTerm)
    );
  }

  // Pagination
  const skipNum = parseInt(skip as string);
  const limitNum = parseInt(limit as string);
  const paginatedProducts = filteredProducts.slice(skipNum, skipNum + limitNum);

  res.json({
    products: paginatedProducts,
    total: filteredProducts.length,
    skip: skipNum,
    limit: limitNum
  });
});

// Get single product by id
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = productsData.find((p: any) => String(p.id) === id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Get available categories
app.get('/api/categories', (req, res) => {
  const categories = Array.from(
    new Set(
      productsData
        .map((p: any) => p.category)
        .filter(Boolean)
    )
  ).sort();

  res.json({ categories });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    products: productsData.length,
    source: 'Mock Data'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Serving ${productsData.length} mock products`);
  console.log(`🔗 API endpoints:`);
  console.log(`   GET /api/products?category=all&limit=50&skip=0`);
  console.log(`   GET /api/products/:id`);
  console.log(`   GET /api/categories`);
  console.log(`   GET /health`);
});
