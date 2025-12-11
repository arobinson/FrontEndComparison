import { Route, Navigate } from '@solidjs/router';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

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
