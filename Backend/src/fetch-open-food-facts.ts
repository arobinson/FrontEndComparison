import { writeFileSync } from 'fs';
import { join } from 'path';

interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  generic_name?: string;
  brands?: string;
  categories?: string;
  origins?: string;
  manufacturing_places?: string;
  stores?: string;
  countries?: string;
  labels?: string;
  packaging?: string;
  quantity?: string;
  serving_size?: string;
  nutrition_score_fr?: number;
  nova_group?: number;
  ecoscore_score?: number;
  allergens?: string;
  traces?: string;
  vegetarian?: string;
  vegan?: string;
  palm_oil_free?: string;
  created_t?: number;
  last_modified_t?: number;
  ingredients_text?: string;
  completeness?: number;
  unique_scans_n?: number;
  scans_n?: number;
  ingredients_n?: number;
  unknown_ingredients_n?: number;
  additives_n?: number;
  ecoscore_grade?: string;
  nutriscore_grade?: string;
  nutriscore_score?: number;
  purchase_places?: string;
  main_category?: string;
  images?: {
    front_small?: { display?: string };
    front?: { display?: string };
    ingredients_small?: { display?: string };
    ingredients?: { display?: string };
    nutrition_small?: { display?: string };
    nutrition?: { display?: string };
    packaging_small?: { display?: string };
    packaging?: { display?: string };
  };
  image_front_small_url?: string;
  image_front_url?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kcal_serving'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    sugars_100g?: number;
    fiber_100g?: number;
    'saturated-fat_100g'?: number;
    sodium_100g?: number;
    salt_100g?: number;
    cholesterol_100g?: number;
    caffeine_100g?: number;
  };
}

interface OpenFoodFactsResponse {
  products: OpenFoodFactsProduct[];
  count: number;
  page: number;
  page_size: number;
  page_count: number;
}

const categories = ['beverages', 'dairy', 'snacks', 'breakfast-cereals', 'chocolate', 'bread', 'fruits', 'vegetables'];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchCategoryProducts(category: string, pageSize = 25): Promise<OpenFoodFactsProduct[]> {
  try {
    console.log(`Fetching ${pageSize} products from category: ${category}`);

    const url = `https://world.openfoodfacts.org/category/${category}.json?page_size=${pageSize}&page=1&fields=code,product_name,generic_name,brands,categories,origins,manufacturing_places,stores,countries,labels,packaging,quantity,serving_size,nutrition_score_fr,nova_group,ecoscore_score,allergens,traces,vegetarian,vegan,palm_oil_free,created_t,last_modified_t,ingredients_text,completeness,unique_scans_n,scans_n,ingredients_n,unknown_ingredients_n,additives_n,nutrient_levels,ecoscore_grade,nutriscore_grade,languages_codes,editors_tags,states,images,image_front_url,image_front_small_url,nutriments`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FrontEndComparison/1.0 (performance-testing@example.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenFoodFactsResponse = await response.json();
    console.log(`✅ Fetched ${data.products?.length || 0} products from ${category}`);

    return data.products || [];
  } catch (error) {
    console.error(`❌ Error fetching ${category}:`, error);
    return [];
  }
}

async function main() {
  console.log('🚀 Starting OpenFoodFacts data fetch...\n');

  const allProducts: OpenFoodFactsProduct[] = [];

  for (const category of categories) {
    const products = await fetchCategoryProducts(category, 20); // ~20 per category = ~160 total
    allProducts.push(...products);

    // Be nice to their API - wait 1 second between requests
    await sleep(1000);
  }

  console.log(`\n📊 Total products fetched: ${allProducts.length}`);

  // Filter out products without essential data
  const validProducts = allProducts.filter((p) => p.code && p.product_name && p.product_name.trim().length > 0);

  console.log(`📊 Valid products after filtering: ${validProducts.length}`);

  // Enrich products with individual API calls to get proper image URLs
  console.log(`\n📸 Enriching products with image URLs...`);
  const enrichedProducts: OpenFoodFactsProduct[] = [];

  for (let i = 0; i < validProducts.length; i++) {
    const product = validProducts[i];
    try {
      const individualUrl = `https://world.openfoodfacts.org/api/v0/product/${product.code}.json?fields=image_thumb_url,image_small_url,image_url`;
      const response = await fetch(individualUrl, {
        headers: {
          'User-Agent': 'FrontEndComparison/1.0 (performance-testing@example.com)'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.product) {
          enrichedProducts.push({
            ...product,
            image_front_small_url: data.product.image_small_url,
            image_front_url: data.product.image_url
          });
        } else {
          enrichedProducts.push(product);
        }
      } else {
        enrichedProducts.push(product);
      }

      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`  📸 Processed ${i + 1}/${validProducts.length} products`);
      }

      // Be nice to their API - wait 100ms between requests
      await sleep(100);
    } catch (error) {
      console.error(`❌ Error enriching product ${product.code}:`, error);
      enrichedProducts.push(product);
    }
  }

  console.log(`📸 Image enrichment complete: ${enrichedProducts.length} products processed`);

  // Save to shared data directory
  const dataPath = join(process.cwd(), '..', 'shared-data', 'open-food-facts-products.json');

  const exportData = {
    metadata: {
      fetchedAt: new Date().toISOString(),
      totalProducts: enrichedProducts.length,
      categories: categories,
      source: 'OpenFoodFacts API'
    },
    products: enrichedProducts
  };

  writeFileSync(dataPath, JSON.stringify(exportData, null, 2));
  console.log(`✅ Data saved to: ${dataPath}`);
  console.log(`📁 File size: ${(JSON.stringify(exportData).length / 1024 / 1024).toFixed(2)} MB`);

  // Print category breakdown
  console.log('\n📈 Category breakdown:');
  const categoryCount = enrichedProducts.reduce(
    (acc, product) => {
      const category = product.categories?.split(',')[0]?.trim() || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });
}

main().catch(console.error);
