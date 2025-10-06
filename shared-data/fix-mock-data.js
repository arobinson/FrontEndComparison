import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('MOCK_DATA.json', 'utf8'));

const fixedData = data.map((product) => ({
  ...product,
  // Fix image URLs - use seed parameter for consistent images
  image_url: `https://picsum.photos/seed/${product.id}/200/200`,
  thumbnail_url: `https://picsum.photos/seed/${product.id + 1000}/100/100`,

  // Fix null fields with reasonable defaults
  sku:
    product.sku ||
    `SKU-${String(product.id).padStart(3, '0')}-${Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0')}`,
  model_number:
    product.model_number ||
    `MOD-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, '0')}`,
  barcode:
    product.barcode ||
    Math.floor(Math.random() * 999999999999)
      .toString()
      .padStart(12, '0'),
  warehouse_location:
    product.warehouse_location || ['California', 'Texas', 'New York', 'Florida', 'Illinois'][Math.floor(Math.random() * 5)],
  dimensions_cm:
    product.dimensions_cm ||
    `${Math.floor(Math.random() * 50) + 10}x${Math.floor(Math.random() * 50) + 10}x${Math.floor(Math.random() * 50) + 10}`
}));

fs.writeFileSync('MOCK_DATA.json', JSON.stringify(fixedData, null, 2));
console.log('✅ Fixed MOCK_DATA.json');
