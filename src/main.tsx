import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Monkeypatch fetch to redirect /api/* to the local WordPress REST API when running in WP context
try {
  const originalFetch = window.fetch;
  
  // Use Object.defineProperty to bypass getter-only property assignment restrictions in sandboxed browsers
  Object.defineProperty(window, 'fetch', {
    value: function(input: RequestInfo | URL, init?: RequestInit) {
      if (typeof input === 'string' && input.startsWith('/api/')) {
        const isWordPress = window.location.pathname.includes('/wp-admin') || (window as any).ajaxurl || window.location.href.includes('page=kamva');
        if (isWordPress) {
          // Direct the request to the WordPress REST API endpoint registered by our theme
          const wpApiUrl = `/wp-json/kamvapro/v1/api/${input.substring(5)}`;
          return originalFetch(wpApiUrl, init);
        }
      }
      return originalFetch(input, init);
    },
    writable: true,
    configurable: true,
    enumerable: true
  });
} catch (e) {
  console.warn('Could not redefine window.fetch via Object.defineProperty.', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
