export const config = {
  runtime: 'edge',
};

const DEFAULT_URL = "https://purstream.ad/";

export default async function handler(request) {
  let targetUrl = DEFAULT_URL;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("https://purstream.wiki/api/server-status", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
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
        targetUrl = mainServer.url;
      }
    }
  } catch (error) {
    console.error("Erreur redirect:", error);
  }

  return Response.redirect(targetUrl, 307);
}
