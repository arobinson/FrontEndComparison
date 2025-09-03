# Frontend Framework Comparison Implementation Plan

## Project Overview

Build identical ecommerce product table applications across Angular, React, Svelte, and SolidJS to compare performance and bundle sizes. Each app features a 200-product × 54-column table with 17+ diverse component types, plus detailed product views. Data is served from local mock JSON for consistent performance testing.

## Shared Components (TypeScript)

### `/shared-styles/` Directory Structure

```text
shared-styles/
└── variables.css             # CSS custom properties only (colors, spacing, fonts, breakpoints)
```

**CSS Strategy**:

- **Shared**: Only CSS custom properties/variables for consistent theming
- **Framework-specific**: Each framework implements component styles using their preferred approach
- **Benefits**: Tests each framework's CSS handling (Angular component styles, React CSS modules, Svelte scoped styles, SolidJS styled components)

**Table Layout Specifications**:

- **Sticky header**: Column names and filter row always visible during scroll
- **Sticky footer**: Pagination controls always visible at bottom
- **Viewport-fit**: Table fills available viewport height
- **Scrollable**: Both horizontal (columns) and vertical (rows) scrolling
- **Reset filter button**: Positioned in table header area

### `/shared-types/` Directory Structure

```text
shared-types/
├── product.types.ts          # Complete OpenFoodFacts product interface
├── api.types.ts              # API request/response types  
├── field-config.ts           # Table column definitions & formatting rules
├── data-transformers.ts      # Raw API → display format converters
├── api-client.ts             # Framework-agnostic OpenFoodFacts API client (pure TypeScript)
├── performance-utils.ts      # Measurement utilities
└── constants.ts              # URLs, pagination limits, etc.
```

### Mock Data Structure (54 fields)

**Flat Product Model** (snake_case from Mockaroo):

All product fields are at the root level for optimal table performance (`value[column]` access):

**Core Product (8 fields)**: id, product_name, brand, description, category, sku, model_number, barcode
**Contact (4 fields)**: first_name, last_name, supplier_email, supplier_phone  
**Financial (6 fields)**: price, cost, wholesale_price, currency_code, tax_rate, discount_percent
**Inventory (4 fields)**: stock_quantity, units_sold, reorder_level, warehouse_location
**Quality (6 fields)**: quality_score, customer_rating, review_count, grade, safety_rating, eco_score
**Dates (4 fields)**: created_date, last_updated, release_date, next_restock_date
**Flags (6 fields)**: in_stock, is_featured, is_best_seller, requires_shipping, is_digital, has_warranty
**Visual (3 fields)**: image_url, color, thumbnail_url
**Geographic (4 fields)**: origin_country, manufacturer_country, product_language, shipping_zone
**Technical (7 fields)**: supplier_tax_id, material, size, weight_kg, dimensions_cm, certification, warranty_months
**Time (2 fields)**: shipping_departure_time, flight_duration_hours

## Data Table Component Types (17+ components)

Each framework must implement these component types to showcase different rendering patterns:

### 1. **product-link** (`id` field)
- Links to product detail page: `/detail/{id}`
- Framework-specific routing integration

### 2. **simple-text** (brand, product_name, sku, etc.)  
- Plain text display with overflow handling

### 3. **truncated-text** (`description` field)
- Long text with truncation + tooltip/expandable

### 4. **full-name** (first_name + last_name combination)
- Combines two fields: "John Doe" format
- Tests template string composition

### 5. **name-initials** (first_name + last_name initials)
- Displays: "J.D." format  
- Useful for compact display modes

### 6. **email-masked** (`supplier_email`)  
- Shows: "jo***@example.com" format
- Privacy-friendly display

### 7. **phone-formatted** (`supplier_phone`)
- Formats: "(555) 123-4567" display
- Regional formatting support

### 8. **progress-bar** (quality_score, eco_score 0-100)
- Visual progress bars with percentage text
- Color-coded: red/yellow/green zones

### 9. **grade-badge** (`grade` field A-F)
- Colored badges: A=green, B=blue, C=yellow, D=orange, F=red
- Typography and color theming

### 10. **nova-dots** (`safety_rating` 1-4) 
- Visual dots: ●●●○ (3 filled, 1 empty)
- Interactive hover states

### 11. **large-counter** (`units_sold`, `review_count`)
- Formatted with commas: "1,234,567"
- Abbreviations for large numbers: "1.2M"

### 12. **decimal-units** (`price`, `cost`, `weight_kg`)
- Currency/unit formatting: "$123.45", "5.2 kg"
- Locale-aware number formatting  

### 13. **currency-formatted** (wholesale_price + currency_code)
- Combines amount + currency: "€156.78"
- Multi-currency support

### 14. **boolean-yesno** (in_stock, is_featured, etc.)
- Displays: "Yes" / "No" with color coding
- Icon alternatives: ✓/✗

### 15. **color-chip** (`color` field)
- Visual color swatches with names
- Accessibility compliance

### 16. **country-flag** (origin_country, manufacturer_country)
- Country code → flag emoji + country name
- "US 🇺🇸 United States" format

### 17. **product-image** (`image_url`, `thumbnail_url`)
- Lazy-loaded images with fallbacks
- Loading states and error handling

### 18. **time-display** (`shipping_departure_time`)
- Time formatting: "2:30 PM" or "14:30"
- Timezone considerations

### 19. **calculated-arrival** (departure_time + flight_duration_hours)
- Computed field: shows arrival time
- Tests reactive calculations

### 20. **absolute-date** (`created_date`, `release_date`)
- Full date format: "March 15, 2024, 2:30 PM"
- Localized date formatting

### 21. **relative-date** (`last_updated`)  
- Relative format: "2 days ago", "3 hours ago"
- Auto-updating time display

### Shared Utilities

- **Data transformers**: API response → camelCase view model converters (product_name → productName)
- **Field formatters**: Number formatting, date parsing, image URL builders
- **API client**: Framework-agnostic API client with endpoints:
  - Product data: OpenFoodFacts integration  
  - Filter metadata: `/api/filter-options/*` endpoints
- **Performance measurement**: Timing utilities, memory usage helpers

## Framework-Specific Implementations

### Angular (`/AngularFoodFacts/`)

**Modern Features**:

- `resource()` API for data fetching
- Zoneless change detection (already configured)
- Control flow syntax (`@for`, `@if`, `@defer`)
- Signal-based reactivity throughout
- `@defer` blocks with viewport triggers for lazy loading

**Components**:

- `ProductListComponent`: 50×50+ table using diverse specialized components
- `ProductDetailComponent`: Complex nested data display using same components
- `LoadingComponent`, `ErrorComponent`

**Total: 22 Unique Components** (10 display + 8 filter + 2 table + 2 navigation)

**Display Components** (10 unique):

- `progress-bar` - completeness percentage with visual bar (`@defer` on viewport)
- `nutrition-grade-badge` - A/B/C/D/E colored badges (`@defer` on viewport)
- `nova-dots` - 1-4 filled dots indicator (`@defer` on viewport)
- `product-image` - small (list) vs large (detail) with loading states (`@defer` on viewport)
- `simple-text` - names, brands with basic styling (shows full text)
- `truncated-text-popover` - long text with truncation + popover on click (`@defer` on interaction)
- `large-counter` - scan numbers with comma formatting
- `decimal-units` - nutrition values with units (4.2g, 168 kcal)
- `simple-quantity` - package sizes (33 cl, 1kg)
- `help-tooltip` - question mark icon with explanatory text (`@defer` on hover)

**Filter Input Components** (8 unique):

- `range-slider` - completeness percentage filter (0-100%)
- `grade-selector` - A/B/C/D/E multi-select checkboxes
- `nova-filter` - 1-4 multi-select dots
- `category-multiselect` - 8 main categories (beverages, dairy, snacks, etc.) with checkboxes
- `manufacturing-multiselect` - ~45 manufacturing places with checkboxes  
- `text-search` - countries/brands/stores/packaging search (contains matching)  
- `date-range-picker` - creation/modification date filters
- `number-range` - scan count, nutrition value ranges

**Multi-select Data Sources** (≤25 options for good UX):

- Categories: Fixed 8 options from metadata (beverages, dairy, snacks, etc.)  
- Manufacturing places: Server endpoint `/api/filter-options/manufacturing-places` (~45 unique values)
- Nutrition grades: Fixed A/B/C/D/E options (computed client-side)
- Nova groups: Fixed 1/2/3/4 options (computed client-side)

**Text Search Filters** (>50 options, too many for multi-select):

- Countries: Contains search (~92 unique values)
- Brands: Contains search (~104 unique values)  
- Stores: Contains search (~68 unique values)
- Packaging: Contains search (~102 unique values)

**API Endpoints for Filter Metadata**:

- `GET /api/filter-options/manufacturing-places` - Returns `{ places: string[] }` (~45 options)
- Performance benefit: Only load manageable multi-select options from server

**Table Infrastructure Components** (2 unique):

- `data-table` - main table container with sticky header, viewport-fit scrolling, column management
- `table-paginator` - sticky footer pagination controls with page size options

**Navigation Components** (2 unique):

- `breadcrumb-nav` - simple navigation (List → Detail Product Name)
- `action-button` - styled buttons (Refresh, Reset Filters, etc.)

**Angular-Specific Features**:

- **Pipes** (4): `numberWithCommas`, `relativeDate`, `absoluteDate`, `quantityUnit` for pure data formatting
- **Directives** (2): `helpTooltip` (adds question mark icon), `expandableText` (click to expand/collapse behavior)
- **Structural Directives**: Custom `*sortBy` directive for table sorting logic

**Services**:

- `ProductService`: Pure `resource()` API calls
- `PerformanceService`: Angular-specific measurement hooks

### React (`/ReactFoodFacts/`)

**Modern Features**:

- `use()` hook for data fetching (React 19)
- Concurrent rendering with `startTransition`
- `useDeferredValue` for smooth interactions
- Pure `useState`/`useEffect` only
- **React Router v7**: Official routing library with React 19 support (client-side only)

**Components**:

- `ProductList`: Table with optimized rendering using shared field components
- `ProductDetail`: Complex data display using shared field components
- **Shared field components**: `TextComponent`, `NumericComponent`, `ImageComponent`, `BooleanComponent`, `DateComponent` (reused in both list and detail views)
- Loading/Error boundaries

**React Equivalents**:

- **Custom Hooks**: `useCurrency()`, `useDate()`, `useDecimal()`, `usePercent()` for data formatting (pipe equivalents)
- **HOCs/Render Props**: `withHighlight()`, `withTooltip()`, `withLazyLoad()` for behavior enhancement (directive equivalents)
- **Utility Functions**: `sortBy()` helper for table sorting logic

**Hooks**:

- `useProducts`: Data fetching with `use()`
- `usePerformance`: React-specific measurements

### Svelte (`/SvelteFoodFacts/`)

**Modern Features (Svelte 5)**:

- Runes system: `$state()`, `$derived()`, `$effect()`
- Fine-grained reactivity
- Svelte 5 snippets for reusable logic
- Native stores for global state
- **SvelteKit**: Official filesystem-based routing (client-side rendering mode)

**Components**:

- `ProductList.svelte`: Optimized table rendering using shared field components
- `ProductDetail.svelte`: Nested data display using shared field components
- **Shared field components**: `TextComponent.svelte`, `NumericComponent.svelte`, `ImageComponent.svelte`, `BooleanComponent.svelte`, `DateComponent.svelte` (reused in both list and detail views)
- Loading/error states

**Svelte Equivalents**:

- **Actions**: `highlight`, `tooltip`, `lazy-load` for behavior enhancement (directive equivalents)
- **Stores/Derived**: Reactive data formatting with derived stores (pipe equivalents)
- **Utility Functions**: `sortBy()` helper with reactive statements

### SolidJS (`/SolidFoodFacts/`)

**Modern Features**:

- `createResource` for data fetching
- Fine-grained reactivity (no Virtual DOM)
- Suspense boundaries
- Pure signal-based architecture
- **@solidjs/router v0.15.3**: Official universal router (client-side mode)

**Components**:

- `ProductList`: Functional component with JSX using shared field components
- `ProductDetail`: Complex data display using shared field components
- **Shared field components**: `TextComponent`, `NumericComponent`, `ImageComponent`, `BooleanComponent`, `DateComponent` (reused in both list and detail views)
- `createResource` for API calls with granular reactive updates

**SolidJS Equivalents**:

- **Directives**: `use:highlight`, `use:tooltip`, `use:lazyLoad` for behavior enhancement (directive equivalents)
- **Computed Signals**: Reactive data formatting with `createMemo()` (pipe equivalents)  
- **Utility Functions**: `sortBy()` helper with fine-grained reactivity

## Implementation Phases

### Phase 1: Foundation Setup

1. **Create shared-types package** with complete OpenFoodFacts interfaces
2. **Establish field configuration** (47 fields categorized by component type)
3. **Build data transformers** and framework-agnostic API client (pure fetch)
4. **Set up performance testing framework** (Puppeteer scripts)

### Phase 2: Angular Implementation (Lead Implementation)

1. **Complete Angular app** with all 47 field types in table using best Angular practices
2. **Implement product detail view** with complex nested data
3. **Optimize for Angular performance**: OnPush strategy, trackBy functions, pure pipes
4. **Add performance measurement hooks**
5. **Test with 50+ products × 50+ columns** rendering at once
6. **Establish baseline metrics and testing methodology**

### Phase 3: React Implementation

1. **Port Angular functionality** to React with optimal React patterns
2. **Optimize for React performance**: useMemo, useCallback, React.memo, virtualization if beneficial
3. **Implement equivalent component structure** (not identical, but functionally equivalent)
4. **Ensure exact feature parity** with maximum React performance
5. **Performance comparison vs Angular**

### Phase 4: Svelte Implementation

1. **Port to Svelte 5 with runes** and optimal Svelte patterns
2. **Leverage fine-grained reactivity** and compiler optimizations for maximum performance
3. **Optimize for Svelte**: Reactive statements, derived values, component composition
4. **Compare compiler optimizations** vs runtime frameworks

### Phase 5: SolidJS Implementation

1. **Port to SolidJS with signals** and optimal SolidJS patterns
2. **Optimize for SolidJS**: Fine-grained reactivity, minimal re-renders, signal composition
3. **Test fine-grained updates** and compare signal performance
4. **Final performance comparison**

### Phase 6: Results and Analysis

1. **Generate automated performance graphs** comparing all frameworks
2. **Create comprehensive blog post** with charts and analysis
3. **Document findings** and framework-specific optimization techniques
4. **Publish results** for community benefit

## Performance Testing Strategy

### Test Scenarios

1. **Initial Load**: 50 products × 50+ columns with filter headers rendered simultaneously (client-side)
2. **Filter Application**: User types in text filter, tabs out (blur) → measure re-render time
3. **Multiple Filters**: Apply filters across different column types → measure cumulative performance
4. **Sort Operations**: Click column headers → measure sort + re-render time
5. **Client Navigation**: List → Detail → List transitions with filter state preserved (no SSR)
6. **Memory Usage**: Long-running sessions with repeated filtering operations
7. **Bundle Analysis**: Size comparisons across frameworks (client bundles only)
8. **Development Server Performance**: Startup time measurement across frameworks

### Metrics Collected

**Bundle Analysis**:

- **Development builds**: File count, average file size, total bundle size
- **Production builds**: File count, average file size, total bundle size, compression ratios
- **Code splitting**: Chunk distribution and lazy loading effectiveness

**Network Performance**:

- **Request count**: Total HTTP requests during test scenarios
- **Request timing**: Individual request durations and parallel loading
- **Clock time**: Total application waiting time on network responses
- **Data transfer**: Total bytes transferred (request + response payloads)

**Rendering Performance**:

- **Initial list render**: Time to display 50+ products × 50+ columns with filter headers
- **Re-render performance**: List re-display time after filter applied (on blur events)
- **Filter interaction**: Time between blur event and completed re-render
- **Sort performance**: Re-render time for column sorting operations
- **Detail navigation**: Time to navigate to and render individual product detail
- **Return navigation**: Time to return and re-render list view from detail

**Additional Performance Metrics**:

- **Memory usage**: JavaScript heap size during operations (measurable via Puppeteer)
- **Web Vitals**: First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS) (directly measurable)
- **JavaScript execution time**: Pure JS parsing and execution timing (excludes network/rendering)
- **Development server startup**: Time from `pnpm dev` command to server ready and serving requests

### Testing Infrastructure

- **Puppeteer Scripts**: Automated performance measurement with network timing separation
- **Real API Data**: Live OpenFoodFacts API calls for realistic network conditions
- **Consistent Environment**: Same hardware, network conditions, API endpoints
- **Statistical Analysis**: Multiple runs with averaged results
- **Automated Charting**: Generate performance comparison graphs for blog publication
- **Results Export**: JSON/CSV data export for further analysis

## Application Features

### List View (Primary Performance Test)

- **50+ rows** of OpenFoodFacts products
- **50+ columns** with diverse component types using **reusable field components**
- **All rendered at once** (no virtual scrolling/pagination)
- **Real API data** from OpenFoodFacts
- **Header filter components** for each column with data-type-specific inputs:
  - Text fields for string columns (productName, brands, etc.)
  - Number range inputs for numeric columns (energyPer100g, proteinsPer100g, etc.)
  - Dropdown selects for boolean columns (vegetarian, vegan, palmOilFree status)
  - Date pickers for timestamp columns (createdAt, lastModifiedAt)
- **Filter application on blur** (tab/click out of filter input) to measure re-render performance
- **Interactive sorting** per column
- **Component reuse**: Same `TextComponent`, `NumericComponent`, etc. used in table cells

### Detail View (Secondary Test)

- **Complex nested data** display using **the same reusable field components**
- **Arrays**: ingredients, categories, packagings (camelCase, displayed with repeated field components)
- **Objects**: nutritionFacts, ecoScoreData (camelCase, using `NumericComponent`, `TextComponent`)
- **Images**: Multiple product photos (using `ImageComponent`)
- **Component reuse**: Same components as list view but in different layouts and contexts
- **Navigation performance** testing

## Technical Constraints

### Framework Optimization Philosophy

- **Maximum framework performance**: Each implementation optimized for that framework's strengths
- **Client-side rendering only**: No SSR to focus on pure frontend framework performance
- **No third-party state management** (NgRx, Redux, etc.) - use framework-native solutions
- **No UI component libraries** (Material, Ant Design, etc.) - custom optimized components
- **Framework-specific optimizations encouraged**: OnPush, memoization, fine-grained reactivity
- **Latest/preview features** for best-case scenarios
- **Performance over code similarity**: Functional equivalence, not structural similarity

### Data Consistency

- **Identical API calls** using shared framework-agnostic client (pure fetch)
- **Same 50+ product dataset** from live OpenFoodFacts API for testing
- **Consistent field formatting** and display logic
- **Shared TypeScript types** ensure data shape consistency
- **No framework-specific APIs** in shared code (no Angular HttpClient, React hooks, etc.)

## Success Criteria

1. **Functional Parity**: All frameworks implement identical features
2. **Performance Baseline**: Measurable differences in rendering/navigation
3. **Bundle Analysis**: Clear size comparisons  
4. **Real-world Data**: Using actual OpenFoodFacts API
5. **Comprehensive Testing**: Automated performance measurement across all implementations
