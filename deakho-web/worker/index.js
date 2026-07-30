/**
 * DeakhoTV CORS Proxy — Cloudflare Worker
 *
 * Proxies HLS IPTV streams adding CORS headers and JagoBD auth headers.
 * Deploy to Cloudflare Workers for free.
 *
 * Deploy:
 *   npx wrangler deploy worker/index.js --name deakho-proxy
 */

// Allowed upstream hosts (support subdomains and CDN hosts)
const ALLOWED_HOSTS = [
  'static.jagobd.com.bd',
  'byphdgllyk.gpcdn.net',
  'stream.ottplus.live',
  'ekusheyserver.com',
  'live.thebosstv.com',
  'app.ncare.live',
  's1.itcnbd.live',
  'deshitv24.net',
  'deshitv.deshitv24.net',
  'amagi.tv',
  'akamaized.net',
  'directfwd.com',
  'peacetv.directfwd.com',
];

// Host-specific referers
const REFERERS = {
  'static.jagobd.com.bd': 'https://www.jagobd.com/',
  'deshitv.deshitv24.net': 'https://deshitv24.net/',
};

export default {
  async fetch(request, _env, _ctx) {
    const url = new URL(request.url);

    // 1. Health check & Server Status
    if (url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          proxy: 'deakho-cors-v2',
          features: ['stream-proxy', 'health-check', 'auto-failover'],
        }),
        { headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 2. Stream Health Monitoring Endpoint (/check?url=...)
    if (url.pathname === '/check') {
      const target = url.searchParams.get('url');
      if (!target) {
        return new Response(JSON.stringify({ online: false, error: 'Missing url parameter' }), {
          status: 400,
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const startTime = Date.now();
      try {
        const checkRes = await fetch(decodeURIComponent(target), {
          method: 'HEAD',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        });
        const latencyMs = Date.now() - startTime;
        const online = checkRes.ok || checkRes.status === 206;
        return new Response(
          JSON.stringify({
            url: target,
            online,
            status: checkRes.status,
            latencyMs,
            contentType: checkRes.headers.get('content-type') || 'unknown',
          }),
          { headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            url: target,
            online: false,
            error: err.message,
            latencyMs: Date.now() - startTime,
          }),
          { status: 502, headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }
    }

    // 3. Stream Proxy Endpoint with Optional Auto-Failover Backup URL
    const targetParam = url.searchParams.get('url');
    const fallbackParam = url.searchParams.get('fallback');

    if (!targetParam) {
      return new Response('Missing "url" query parameter', { status: 400 });
    }

    const fetchStream = async (targetStr) => {
      const targetUrl = new URL(decodeURIComponent(targetStr));
      const isAllowed = ALLOWED_HOSTS.some(
        (h) => targetUrl.hostname === h || targetUrl.hostname.endsWith(`.${h}`)
      );

      if (!isAllowed) {
        throw new Error(`Host not allowed: ${targetUrl.hostname}`);
      }

      const headers = new Headers(request.headers);
      headers.set('Origin', targetUrl.origin);
      if (REFERERS[targetUrl.hostname]) {
        headers.set('Referer', REFERERS[targetUrl.hostname]);
      }
      headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers,
      });

      if (!response.ok && response.status !== 206) {
        throw new Error(`HTTP Error ${response.status}`);
      }

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

      const contentType = responseHeaders.get('content-type') || '';
      if (
        targetUrl.pathname.endsWith('.m3u8') &&
        !contentType.includes('mpegurl') &&
        !contentType.includes('m3u')
      ) {
        responseHeaders.set('content-type', 'application/vnd.apple.mpegurl');
      }

      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    };

    try {
      return await fetchStream(targetParam);
    } catch (err) {
      console.warn(`Primary stream failed (${err.message})...`);
      if (fallbackParam) {
        try {
          console.log(`Attempting fallback stream auto-failover...`);
          return await fetchStream(fallbackParam);
        } catch (fallbackErr) {
          return new Response(`Proxy & Fallback error: ${fallbackErr.message}`, { status: 502 });
        }
      }
      return new Response(`Proxy error: ${err.message}`, { status: 502 });
    }
  },
};
