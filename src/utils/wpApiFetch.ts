/**
 * Robust, authenticated WordPress API Fetch Utility with automatic CSRF Nonce injection
 * 
 * Works flawlessly in both environments:
 * 1. Inside WordPress Admin: uses window.wp.apiFetch with native nonce validation, cookies, and session headers.
 * 2. Inside AI Studio Development Server: falls back to native browser fetch() pointing to Express server endpoints.
 */

export class WordPressApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'WordPressApiError';
    this.status = status;
  }
}

export async function wpApiFetch<T>(options: {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}): Promise<T> {
  const isWordPress = typeof window !== 'undefined' && (window as any).wp && (window as any).wp.apiFetch;
  
  if (isWordPress) {
    try {
      // Re-route paths starting with "/api/" to the theme REST namespace registered in api-bridge.php
      let wpPath = options.path;
      if (wpPath.startsWith('/api/')) {
        wpPath = `/kamvapro/v1/api/${wpPath.substring(5)}`;
      } else if (!wpPath.startsWith('/')) {
        wpPath = `/${wpPath}`;
      }

      const apiFetchParams: any = {
        path: wpPath,
        method: options.method || 'GET',
      };

      if (options.data) {
        apiFetchParams.data = options.data;
      }

      // wp.apiFetch automatically injects nonce headers from wpApiSettings.nonce
      return await (window as any).wp.apiFetch(apiFetchParams);
    } catch (err: any) {
      console.warn('WordPress native apiFetch failed or returned unauthorized, trying fallback fetch', err);
      // If the error has a status, propagate it
      if (err && err.status) {
        throw new WordPressApiError(err.message || 'WordPress REST API returned an error', err.status);
      }
    }
  }

  // Fallback / Development standard browser fetch with automatic CSRF / Nonce extraction
  let fetchUrl = options.path;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Try extracting enqueued WordPress REST Nonce (wp_rest) for CSRF security validation
  if (typeof window !== 'undefined') {
    const wpNonce = (window as any).wpApiSettings?.nonce || 
                    (window as any).kamvaWebData?.nonce || 
                    (window as any).kamvaWebData?.restNonce ||
                    (window as any).kamvaSettings?.nonce || '';
    if (wpNonce) {
      // Inject standard WP Nonce header for session validation
      headers['X-WP-Nonce'] = wpNonce;
    }
  }

  const init: RequestInit = {
    method: options.method || 'GET',
    headers: headers,
  };

  if (options.data && (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE')) {
    init.body = JSON.stringify(options.data);
  }

  const response = await fetch(fetchUrl, init);
  if (!response.ok) {
    throw new WordPressApiError(`HTTP error! status: ${response.status}`, response.status);
  }
  
  return await response.json() as T;
}
