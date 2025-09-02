import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join } from 'path';
import { transformOpenFoodFactsToProductViewModel, type OpenFoodFactsProduct } from 'shared-types';

const app = express();
const PORT = 3001;

// Enable CORS for frontend apps
app.use(cors());
app.use(express.json());

// Load the Open Food Facts data
let productsData: any;
try {
  const dataPath = join(process.cwd(), '..', 'shared-data', 'open-food-facts-products.json');
  productsData = JSON.parse(readFileSync(dataPath, 'utf-8'));
  console.log(`📊 Loaded ${productsData.products.length} products from Open Food Facts`);
} catch (error) {
  console.error('❌ Failed to load Open Food Facts data:', error);
  process.exit(1);
}

// Transform all products to ProductViewModel format
const transformedProducts = productsData.products.map((product: OpenFoodFactsProduct) => 
  transformOpenFoodFactsToProductViewModel(product)
);

// API Routes
app.get('/api/products', (req, res) => {
  const { category, limit = '50', skip = '0', search } = req.query;
  
  let filteredProducts = transformedProducts;
  
  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter((product: any) => 
      product.categories?.toLowerCase().includes((category as string).toLowerCase())
    );
  }
  
  // Search filter
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredProducts = filteredProducts.filter((product: any) => 
      product.productName?.toLowerCase().includes(searchTerm) ||
      product.brands?.toLowerCase().includes(searchTerm) ||
      product.categories?.toLowerCase().includes(searchTerm)
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

// Get single product by code
app.get('/api/products/:code', (req, res) => {
  const { code } = req.params;
  const product = transformedProducts.find((p: any) => p.code === code);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Get available categories
app.get('/api/categories', (req, res) => {
  const categories = Array.from(new Set(
    transformedProducts
      .map((p: any) => p.categories)
      .filter(Boolean)
      .flatMap((cats: string) => cats.split(',').map(c => c.trim()))
  )).sort();
  
  res.json({ categories });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    products: transformedProducts.length,
    source: 'Open Food Facts'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Serving ${transformedProducts.length} Open Food Facts products`);
  console.log(`🔗 API endpoints:`);
  console.log(`   GET /api/products?category=beverages&limit=50&skip=0`);
  console.log(`   GET /api/products/:code`);
  console.log(`   GET /api/categories`);
  console.log(`   GET /health`);
});