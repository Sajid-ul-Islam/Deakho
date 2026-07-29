/**
 * DeakhoTV CORS Proxy — Cloudflare Worker
 *
 * Proxies HLS IPTV streams adding CORS headers and JagoBD auth headers.
 * Deploy to Cloudflare Workers for free.
 *
 * Deploy:
 *   npx wrangler deploy worker/index.js --name deakho-proxy
 */

// Allowed upstream hosts
const ALLOWED_HOSTS = [
  'static.jagobd.com.bd',
  'byphdgllyk.gpcdn.net',
  'stream.ottplus.live',
  'ekusheyserver.com',
  'live.thebosstv.com',
  'app.ncare.live',
  's1.itcnbd.live',
];

// Host-specific referers
const REFERERS = {
  'static.jagobd.com.bd': 'https://www.jagobd.com/',
};

export default {
  async fetch(request, _env, _ctx) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/') {
      return new Response(JSON.stringify({ status: 'ok', proxy: 'deakho-cors' }), {
        headers: { 'content-type': 'application/json' },
      });
    }

    // The actual target URL is passed as ?url=...
    const targetParam = url.searchParams.get('url');
    if (!targetParam) {
      return new Response('Missing "url" query parameter', { status: 400 });
    }

    let targetUrl;
    try {
      targetUrl = new URL(decodeURIComponent(targetParam));
    } catch {
      return new Response('Invalid URL', { status: 400 });
    }

    // Validate host
    if (!ALLOWED_HOSTS.includes(targetUrl.hostname)) {
      return new Response(`Host not allowed: ${targetUrl.hostname}`, { status: 403 });
    }

    // Build proxy request
    const headers = new Headers(request.headers);
    headers.set('Origin', new URL(targetUrl).origin);

    // Add referer if needed
    if (REFERERS[targetUrl.hostname]) {
      headers.set('Referer', REFERERS[targetUrl.hostname]);
    }

    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    try {
      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers,
      });

      // Add CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Referer, User-Agent',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
      };

      const responseHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(corsHeaders)) {
        responseHeaders.set(key, value);
      }

      // Override content type for HLS manifests
      const contentType = responseHeaders.get('content-type') || '';
      if (targetUrl.pathname.endsWith('.m3u8') && !contentType.includes('mpegurl') && !contentType.includes('m3u')) {
        responseHeaders.set('content-type', 'application/vnd.apple.mpegurl');
      }

      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(`Proxy error: ${err.message}`, { status: 502 });
    }
  },
};
