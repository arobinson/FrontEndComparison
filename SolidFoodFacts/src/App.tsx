import { lazy } from 'solid-js';
import { Route, Navigate } from '@solidjs/router';

// Route-level code splitting: each page's chunk loads when its route first renders (no preloading)
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

function App() {
  return (
    <>
      <Route path="/" component={() => <Navigate href="/list" />} />
      <Route path="/list" component={ProductList} />
      <Route path="/detail/:code" component={ProductDetail} />
      <Route path="*" component={() => <Navigate href="/list" />} />
    </>
  );
}

export default App;
