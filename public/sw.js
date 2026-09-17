// Service Worker minimal pour valider les critères d'installation PWA
const CACHE_NAME = 'purstream-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Navigation et requêtes gérées en direct pour garantir le streaming et les mises à jour
});
