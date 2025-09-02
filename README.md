# Frontend Framework Performance Comparison

A comprehensive performance and bundle size comparison between modern frontend frameworks: **Angular**, **React**, **Svelte**, and **SolidJS**.

## Project Overview

This repository contains functionally identical implementations of a food product discovery application across multiple frontend frameworks. Each implementation uses the OpenFoodFacts API to demonstrate real-world performance characteristics with complex UI components and data-heavy pages.

## Framework Implementations

- **Angular** (`AngularFoodFacts/`) - Angular 20.x with zoneless change detection and standalone components
- **React** - Coming soon
- **Svelte** - Coming soon  
- **SolidJS** - Coming soon

## Application Features

Each framework implementation includes:

- **Product List Page**: Browse and search food products with 49 columns for performance testing
- **Product Detail Page**: Detailed product information including nutritional data, ingredients, and images
- **Navigation Performance**: Optimized routing between list and detail views
- **OpenFoodFacts Integration**: Real-world product data with consistent dataset for fair comparison

## Data Architecture

### Local Backend for Performance Testing

To ensure consistent and fair performance comparisons across all framework implementations, this project uses a local backend (`Backend/`) that serves cached OpenFoodFacts data:

- **Consistent Dataset**: All frameworks use the same ~150 products to ensure identical testing conditions
- **Cached Data**: Local JSON file (`shared-data/open-food-facts-products.json`) eliminates network variability
- **Performance Optimized**: Removes API rate limiting and network latency from performance measurements
- **Real Product Data**: Genuine OpenFoodFacts data, not mock/synthetic data

### Backend Setup

```bash
cd Backend
pnpm install
pnpm start  # Runs on http://localhost:3001
```

The backend provides endpoints for:
- `/api/products` - Paginated product listing with search and category filtering
- `/api/products/:code` - Individual product details

### Data Generation

To refresh the cached dataset with latest OpenFoodFacts data:

```bash
cd Backend
pnpm exec ts-node src/fetch-open-food-facts.ts
```

This fetches ~150 products across 8 categories with complete nutritional data and working image URLs.

## Performance Testing

### Metrics Measured
- **Web Vitals**: First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS)
- **Bundle Analysis**: JavaScript bundle sizes, code splitting effectiveness
- **Runtime Performance**: Component rendering speed, memory usage, navigation timing
- **Network Performance**: API request handling, image loading optimization

### Testing Methodology
- **Puppeteer Automation**: Consistent performance measurement across all implementations
- **Controlled Environment**: Same hardware, network conditions, and test scenarios
- **Statistical Analysis**: Multiple test runs with averaged results for reliability

## Getting Started

Navigate to any framework directory and follow its specific README for setup instructions.

Example with Angular:
```bash
cd AngularFoodFacts
pnpm install
pnpm exec ng serve
```

## Results

Performance comparison results and analysis will be documented here as implementations are completed.
