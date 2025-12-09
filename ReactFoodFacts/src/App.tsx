import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="/list" element={<ProductList />} />
        <Route path="/detail/:code" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
