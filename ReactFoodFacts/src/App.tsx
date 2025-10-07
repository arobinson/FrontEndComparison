/**
 * React Root App Component with Routing
 * 
 * 🎓 LEARNING: This is a React Function Component
 * ==================================================
 * 
 * In React, components are just JavaScript functions that return JSX.
 * JSX looks like HTML but is actually JavaScript that React transforms.
 * 
 * Key differences from Angular:
 * - No @Component decorator
 * - No template files (.html) - JSX is inline
 * - No selector - components are used like <ComponentName />
 * - Everything is just a function!
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

function App() {
  /**
   * 🎓 LEARNING: React Router Setup
   * ================================
   * 
   * React Router works similarly to Angular Router:
   * 
   * Angular:                      React:
   * --------                      ------
   * provideRouter(routes)    →    <BrowserRouter>
   * RouterOutlet             →    <Routes> + <Route>
   * path: 'list'             →    <Route path="/list">
   * component: ListComp      →    <Route element={<ListComp />}>
   * 
   * Notice: In React, we pass the actual component instance as JSX!
   */
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/detail/:code" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * 🎓 LEARNING: Export Default
 * ============================
 * 
 * In React, we typically use `export default` for components.
 * This allows importing like: import App from './App'
 * 
 * Angular uses named exports: export class App {}
 * Which requires: import { App } from './app'
 */
export default App;
