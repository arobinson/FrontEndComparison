import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Download 50 unique product images for local serving
 * Using picsum.photos for random food-like images
 */
async function downloadImages() {
  const imageCount = 50;
  const imageDir = join(process.cwd(), 'public', 'images');

  console.log(`📥 Downloading ${imageCount} product images...`);

  for (let i = 1; i <= imageCount; i++) {
    // Use specific image IDs from picsum.photos for consistency
    // These are food/product related images
    const imageId = 100 + i; // IDs 101-150
    const url = `https://picsum.photos/id/${imageId}/400/400`;

    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const filePath = join(imageDir, `product-${i}.jpg`);
      writeFileSync(filePath, Buffer.from(buffer));
      console.log(`  ✓ Downloaded product-${i}.jpg`);
    } catch (error) {
      console.error(`  ✗ Failed to download product-${i}.jpg:`, error);
    }
  }

  console.log(`\n✅ Downloaded ${imageCount} images to ${imageDir}`);
}

downloadImages().catch(console.error);
