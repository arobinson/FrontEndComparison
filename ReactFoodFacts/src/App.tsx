import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FrameworkHeader from './components/shared/FrameworkHeader';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

// Get basename from Vite's BASE_URL (set via vite config's `base` option)
// Remove trailing slash for react-router compatibility
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const App = () => {
  return (
    <BrowserRouter basename={basename}>
      <FrameworkHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="/list" element={<ProductList />} />
        <Route path="/detail/:code" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
