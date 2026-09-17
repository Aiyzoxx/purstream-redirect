export const config = {
  runtime: 'edge', // Déploiement sur le réseau Edge mondial (latence ultra-faible)
};

export default async function handler(request) {
  try {
    const res = await fetch("https://purstream.wiki/api/server-status", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (res.ok) {
      const data = await res.json();
      const mainServer = data.servers?.find(s => s.id === 'main');

      if (mainServer && mainServer.url) {
        // Redirection 307 (Temporary Redirect) : force le navigateur à revérifier à chaque visite
        return Response.redirect(mainServer.url, 307);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'URL officielle:", error);
  }

  // Fallback de secours vers le wiki si l'API ne répond pas
  return Response.redirect("https://purstream.wiki/", 307);
}
