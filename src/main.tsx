import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Lock to portrait when running as installed PWA
if (window.matchMedia('(display-mode: standalone)').matches && screen.orientation?.lock) {
  screen.orientation.lock('portrait-primary').catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
