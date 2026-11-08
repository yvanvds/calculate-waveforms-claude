import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../design-system/tokens.css';
import '../design-system/components/bundle.css';
import './App.css';
import App from './App.tsx';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Het element #root ontbreekt in index.html.');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
