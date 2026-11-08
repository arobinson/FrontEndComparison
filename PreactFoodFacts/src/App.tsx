import { useEffect } from 'preact/hooks';
import { LocationProvider, Router, Route, lazy, useLocation } from 'preact-iso';
import FrameworkHeader from './components/layout/FrameworkHeader';
import { BASE, toPath } from './config/routes';

// Route-level code splitting with preact-iso's lazy(); chunks load on first
// visit only (no .preload()).
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

// Equivalent of React Router's <Navigate to="/list" replace />: renders nothing.
const RedirectToList = () => {
  const { route } = useLocation();
  // Real side effect: imperative router navigation (history.replaceState), run after render.
  useEffect(() => {
    route(toPath('/list'), true);
  }, []);
  return null;
};

const App = () => {
  return (
    // `scope` limits link interception to this app's base path, so the
    // framework switcher's links to other apps (/react/..., /svelte/...) are
    // left to the browser.
    <LocationProvider scope={`${BASE}/`}>
      <FrameworkHeader />
      <Router>
        <Route path={toPath('/')} component={RedirectToList} />
        <Route path={toPath('/list')} component={ProductList} />
        <Route path={toPath('/detail/:code')} component={ProductDetail} />
      </Router>
    </LocationProvider>
  );
};

export default App;
