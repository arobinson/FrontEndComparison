/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import './index.css';
import App from './App';

// Get base from Vite's BASE_URL (set via vite config's `base` option)
// Remove trailing slash for @solidjs/router compatibility
const base = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

const root = document.getElementById('root');

render(
  () => (
    <Router base={base}>
      <App />
    </Router>
  ),
  root!
);
