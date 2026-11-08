import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import FrameworkHeader from './components/layout/FrameworkHeader';

// Route-level code splitting (react.dev: split by route). Loaded on navigation, never prefetched.
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

// Get basename from Vite's BASE_URL (set via vite config's `base` option)
// Remove trailing slash for react-router compatibility
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const App = () => {
  return (
    <BrowserRouter basename={basename}>
      <FrameworkHeader />
      {/* fallback={null}: no extra markup while a route chunk loads, matching the other apps */}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<ProductList />} />
          <Route path="/detail/:code" element={<ProductDetail />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
