# Frontend Framework Performance Comparison

A comprehensive performance comparison between modern frontend frameworks: **Angular**, **React**, **Svelte**, **SolidJS**, and **Lit**.

## Read the Full Analysis

**[Frontend Framework Performance Comparison (Medium)](https://medium.com/)** | [Markdown Version](Blog/Story.md)

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install Dependencies

```bash
pnpm install
```

### Start the Backend

```bash
cd Backend && pnpm run dev
```

The backend runs on `http://localhost:3001` and serves cached product data.

### Run a Framework (Development)

```bash
# Angular
cd AngularFoodFacts && pnpm exec ng serve

# React
cd ReactFoodFacts && pnpm run dev

# Svelte
cd SvelteFoodFacts && pnpm run dev

# SolidJS
cd SolidFoodFacts && pnpm run dev

# Lit
cd LitFoodFacts && pnpm run dev
```

### Build for Production

```bash
# Angular
cd AngularFoodFacts && pnpm exec ng build

# React
cd ReactFoodFacts && pnpm run build

# Svelte
cd SvelteFoodFacts && pnpm run build

# SolidJS
cd SolidFoodFacts && pnpm run build

# Lit
cd LitFoodFacts && pnpm run build
```

### Run Performance Tests

```bash
cd performance-tests && pnpm run test
```

Results are saved to `performance-tests/results/`.

## Project Structure

```text
FrontEndComparison/
├── AngularFoodFacts/    # Angular 21.x implementation
├── ReactFoodFacts/      # React 19.x implementation
├── SvelteFoodFacts/     # SvelteKit 2.x / Svelte 5.x implementation
├── SolidFoodFacts/      # SolidJS 1.x implementation
├── LitFoodFacts/        # Lit 3.x implementation
├── Backend/             # Node.js API server
├── shared-types/        # TypeScript types shared across frameworks
├── shared-data/         # Cached product data (JSON)
├── performance-tests/   # Puppeteer-based test runner
├── Blog/                # Charts and raw data for the blog post
└── Story.md             # Full performance analysis
```

## Framework Versions

| Framework | Version | Build Tool            |
| --------- | ------- | --------------------- |
| Angular   | 21.0.3  | Angular CLI / esbuild |
| React     | 19.2.1  | Vite 7.1.7            |
| Svelte    | 5.33.0  | SvelteKit / Vite 6.3  |
| SolidJS   | 1.9.10  | Vite 7.2.4            |
| Lit       | 3.2.0   | Vite 7.2.4            |

## License

MIT
