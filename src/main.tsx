import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Reloads once a newly deployed version takes over, so an open app never
// keeps running old code against files that no longer exist
registerSW({ immediate: true });

// Lock to portrait when running as installed PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
  const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
  orientation.lock?.('portrait-primary')?.catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
