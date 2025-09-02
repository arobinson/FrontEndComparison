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

- **Product List Page**: Browse and search food products with filtering capabilities
- **Product Detail Page**: Detailed product information including nutritional data, ingredients, and images
- **Navigation Performance**: Optimized routing between list and detail views
- **OpenFoodFacts Integration**: Real-world API consumption and data handling

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
