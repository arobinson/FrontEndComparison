import { useEffect } from 'preact/hooks';
import { LocationProvider, Router, Route, useLocation } from 'preact-iso';
import FrameworkHeader from './components/shared/FrameworkHeader';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import { BASE, toPath } from './config/routes';

// Equivalent of React Router's <Navigate to="/list" replace />: navigates in an
// effect after render and renders nothing.
const RedirectToList = () => {
  const { route } = useLocation();
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
