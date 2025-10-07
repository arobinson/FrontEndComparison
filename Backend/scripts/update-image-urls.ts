import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Update MOCK_DATA.json to use local image URLs served by backend
 */
function updateImageUrls() {
  const dataPath = join(process.cwd(), '..', 'shared-data', 'MOCK_DATA.json');
  const products = JSON.parse(readFileSync(dataPath, 'utf-8'));

  console.log(`📝 Updating ${products.length} products with local image URLs...`);

  // Update each product with local image URLs
  // Use modulo to cycle through 50 available images
  for (let i = 0; i < products.length; i++) {
    const imageNum = (i % 50) + 1; // 1-50
    products[i].image_url = `http://localhost:3001/images/product-${imageNum}.jpg?size=medium`;
    products[i].thumbnail_url = `http://localhost:3001/images/product-${imageNum}.jpg?size=thumbnail`;
  }

  // Write updated data back
  writeFileSync(dataPath, JSON.stringify(products, null, 2));

  console.log(`✅ Updated all products with local image URLs`);
  console.log(`   - Images: http://localhost:3001/images/product-{1-50}.jpg?size=medium`);
  console.log(`   - Thumbnails: http://localhost:3001/images/product-{1-50}.jpg?size=thumbnail`);
}

updateImageUrls();
