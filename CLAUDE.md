# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains frontend framework comparison projects for measuring performance and bundle sizes across multiple frameworks: Angular, React, Svelte, and SolidJS. Each framework implementation will be functionally identical, building a frontend for OpenFoodFacts data with navigation between product list and detail pages.

Current projects:

- `AngularFoodFacts/` - Angular 20.x application using modern features like zoneless change detection and standalone components

## Commands

Navigate to the AngularFoodFacts directory for all operations:

```bash
cd AngularFoodFacts
```

### Development

- **Start dev server**: `pnpm exec ng serve`
- **Build**: `pnpm exec ng build`
- **Build with watch**: `pnpm exec ng build --watch --configuration development`

### Testing

- **Run tests**: `pnpm exec ng test` (uses Karma + Jasmine)
- **Run single test**: `pnpm exec ng test --include="**/specific-file.spec.ts"`

### Code Generation

- **Generate component**: `pnpm exec ng generate component component-name`
- **See available schematics**: `pnpm exec ng generate --help`

## Backend Server

**IMPORTANT**: This project includes a local Node.js backend server for performance testing.

### Backend Location and Commands

- **Source code**: `Backend/src/server.ts`
- **Start server**: `cd Backend && pnpm run dev` (uses tsx with watch mode)
- **API endpoint**: `http://localhost:3001/api`
- **Data transformers**: Uses `shared-types` transformers for reliable field mapping

### Backend Architecture

The backend serves cached OpenFoodFacts data using our reliable field transformers:

- Loads data from `../shared-data/open-food-facts-products.json`
- Transforms using `transformOpenFoodFactsToProductViewModel` from shared-types
- Provides REST API with filtering, search, and pagination
- Returns only reliable fields (80%+ data completeness) for consistent table display

### API Endpoints

- `GET /api/products?category=food&limit=50&skip=0` - Get products by category
- `GET /api/products/:code` - Get single product by barcode
- `GET /api/categories` - Get available categories
- `GET /health` - Health check

**Never bypass the local backend** - it's essential for performance testing and provides fast, reliable data.

### Package Manager

**CRITICAL**: This project uses pnpm exclusively.

- **✅ ALWAYS use**: `pnpm`, `pnpm run`, `pnpm exec`
- **❌ NEVER use**: `npm`, `npx`, `yarn`
- **Angular commands**: `pnpm exec ng [command]` (never `ng [command]` directly)
- **All scripts**: Use `pnpm run [script]` or `pnpm -r [command]` for workspace operations

## Architecture

### Angular Configuration

- **Angular 20.x** with zoneless change detection enabled
- **Standalone components** architecture (no NgModules)
- **Custom component prefix**: `AngularFoodFacts`
- **Package manager**: pnpm (configured in angular.json)
- **Test generation disabled** by default for all schematics

### Key Files

- `src/app/app.config.ts`: Application configuration with zoneless change detection
- `src/app/app.ts`: Root standalone component
- `angular.json`: Project configured with pnpm, tests disabled by default
- Bundle size budgets: 500kB warning, 1MB error for initial bundles

### TypeScript Configuration

- Strict mode enabled with additional compiler checks
- Angular strict template checking enabled
- Target: ES2022, module: preserve

## Performance Measurement Framework

Each project implements identical functionality for performance comparison:

### Application Features

- **OpenFoodFacts Integration**: Frontend displaying product data from OpenFoodFacts API
- **Product List Page**: Grid/list view of food products with search/filtering
- **Product Detail Page**: Detailed view of individual product information
- **Navigation Testing**: Performance measurement during list ↔ detail page transitions

### Performance Metrics

- **Standard Web Vitals**: First Contentful Paint (FCP), Largest Contentful Paint (LCP)
- **Load Performance**: Bundle size analysis and runtime performance
- **Navigation Performance**: Page transition timing measurements
- **Component Rendering**: Performance with many components and large page data

### Testing Framework

- **Puppeteer Integration**: Automated performance measurement across all framework implementations
- **Consistent Testing Environment**: Same hardware, network conditions, and test scenarios
- **Comparative Analysis**: Side-by-side performance metrics and bundle size comparisons

## Documentation Standards

### Markdown Files

- **Always follow markdownlint rules** for consistent formatting
- **Blank lines required**: Around all headings and lists
- **Code blocks**: Must specify language (e.g., `typescript`, `bash`)
- **Single trailing newline**: Files must end with exactly one newline
- **Spell check**: Use standard terms (e.g., "First Contentful Paint" not custom abbreviations)
