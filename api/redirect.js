export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const res = await fetch("https://purstream.wiki/api/server-status", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (res.ok) {
      const data = await res.json();
      const mainServer = data.servers?.find(s => s.id === 'main');
      if (mainServer && mainServer.url) {
        return Response.redirect(mainServer.url, 307);
      }
    }
  } catch (error) {
    console.error("Erreur redirect:", error);
  }

  return Response.redirect("https://purstream.wiki/", 307);
}
