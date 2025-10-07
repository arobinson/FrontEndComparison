import express from 'express';
import cors from 'cors';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

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

  // Add cache headers for performance testing
  // Cache for 5 minutes (300 seconds) to allow browser caching during pagination tests
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('ETag', `"products-${category}-${skip}-${limit}"`);

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
    // Add cache headers for product detail pages
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('ETag', `"product-${id}"`);
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Get available categories
app.get('/api/categories', (req, res) => {
  const categories = Array.from(new Set(productsData.map((p: any) => p.category).filter(Boolean))).sort();

  res.json({ categories });
});

// Serve product images with caching and optional thumbnail resizing
app.get('/images/:filename', async (req, res) => {
  const { filename } = req.params;
  const { size } = req.query; // Optional: thumbnail, small, medium, large

  const imagePath = join(process.cwd(), 'public', 'images', filename);

  if (!existsSync(imagePath)) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  try {
    // Set aggressive caching headers for images
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
    res.setHeader('ETag', `"${filename}-${size || 'full'}"`);
    res.setHeader('Content-Type', 'image/jpeg');

    let imageBuffer: Buffer;

    if (size === 'thumbnail') {
      // 80x80 thumbnails for table view
      imageBuffer = await sharp(imagePath).resize(80, 80, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer();
    } else if (size === 'small') {
      // 200x200 for small displays
      imageBuffer = await sharp(imagePath).resize(200, 200, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer();
    } else if (size === 'medium') {
      // 400x400 for detail views
      imageBuffer = await sharp(imagePath).resize(400, 400, { fit: 'cover' }).jpeg({ quality: 90 }).toBuffer();
    } else {
      // Full size (original 400x400 from download)
      imageBuffer = readFileSync(imagePath);
    }

    res.send(imageBuffer);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
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
  console.log(`🖼️  Serving 50 cached product images`);
  console.log(`🔗 API endpoints:`);
  console.log(`   GET /api/products?category=all&limit=50&skip=0`);
  console.log(`   GET /api/products/:id`);
  console.log(`   GET /api/categories`);
  console.log(`   GET /images/:filename?size=thumbnail|small|medium`);
  console.log(`   GET /health`);
});
