import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import App from './App';
import './styles.css';

// Create root and render app
const root = createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback={<div className="loading">Loading...</div>}>
    <App />
  </Suspense>
);