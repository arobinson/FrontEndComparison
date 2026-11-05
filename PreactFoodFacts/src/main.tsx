import { render } from 'preact';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

render(<App />, rootElement);
