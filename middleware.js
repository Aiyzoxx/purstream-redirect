export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

const DEFAULT_URL = "https://purstream.ad/";
let cachedUrl = null;
let cacheTime = 0;

async function getTargetUrl() {
  const now = Date.now();
  if (cachedUrl && now - cacheTime < 300000) { // 5 minutes cache
    return cachedUrl;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("https://purstream.wiki/api/server-status", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://purstream.wiki/",
        "Origin": "https://purstream.wiki",
        "Accept": "application/json"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const mainServer = data.servers?.find(s => s.id === 'main');
      if (mainServer && mainServer.url) {
        cachedUrl = mainServer.url.endsWith('/') ? mainServer.url.slice(0, -1) : mainServer.url;
        cacheTime = now;
        return cachedUrl;
      }
    }
  } catch (error) {
    console.error("Erreur API status in middleware:", error);
  }
  return DEFAULT_URL.slice(0, -1);
}

export default async function middleware(req) {
  const url = new URL(req.url);
  
  // Do not proxy our own API
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  const targetDomain = await getTargetUrl();
  const targetUrl = `${targetDomain}${url.pathname}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...Object.fromEntries(req.headers),
        'host': new URL(targetDomain).host,
        'referer': targetDomain,
        'origin': targetDomain
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      redirect: 'manual'
    });

    // If it's not HTML, just return the proxied response (images, js, css, etc.)
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    }

    // It's HTML. Let's inject our paywall bypass script!
    const text = await response.text();
    
    // Inject custom CSS to hide common paywall overlays and a JS script to forge premium status
    const injection = `
      <style>
        /* Tentative de cacher les overlays de paywall fréquents */
        [class*="paywall"], [id*="paywall"],
        [class*="premium-overlay"], [class*="subscription"],
        .max-banner, #max-lock {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      </style>
      <script>
        (function() {
          console.log("[Purstream-Redirect] Injection du Bypass Max...");
          // Forcer des variables globales communes pour les statuts premium
          window.isPremium = true;
          window.hasMax = true;
          window.userPlan = 'max';
          
          // Intercepter localStorage pour forcer le premium si lu par le JS
          const originalGetItem = localStorage.getItem;
          localStorage.getItem = function(key) {
            const val = originalGetItem.apply(this, arguments);
            if (key.toLowerCase().includes('user') || key.toLowerCase().includes('auth')) {
              try {
                let parsed = JSON.parse(val);
                if (parsed) {
                  parsed.isPremium = true;
                  parsed.plan = 'max';
                  parsed.role = 'max';
                  return JSON.stringify(parsed);
                }
              } catch(e) {}
            }
            return val;
          };
        })();
      </script>
    `;

    // Insert injection just before </head>
    const modifiedText = text.replace('</head>', `${injection}</head>`);

    const headers = new Headers(response.headers);
    headers.delete('content-encoding'); // Since we modified the text, it's no longer compressed in the same way
    headers.delete('content-length');

    return new Response(modifiedText, {
      status: response.status,
      headers: headers
    });

  } catch (err) {
    console.error("Proxy error:", err);
    return new Response("Proxy Error", { status: 500 });
  }
}
