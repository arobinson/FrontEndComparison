import { Route, Navigate } from '@solidjs/router';
import FrameworkHeader from './components/shared/FrameworkHeader';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <>
      <FrameworkHeader />
      <Route path="/" component={() => <Navigate href="/list" />} />
      <Route path="/list" component={ProductList} />
      <Route path="/detail/:code" component={ProductDetail} />
      <Route path="*" component={() => <Navigate href="/list" />} />
    </>
  );
}

export default App;
