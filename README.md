# 📱 Purstream PWA & Auto-Redirect (Vercel)

Application Web Progressive (PWA) de **Purstream** déployable sur **Vercel**.

Cette application résout définitivement le problème des changements d'adresse :
1. **Elle s'installe comme une vraie application native** sur votre PC (Windows/Mac) ou téléphone (Android/iOS) avec l'icône officielle de Purstream.
2. **Elle reste toujours en mode application** (fenêtre autonome sans barre d'adresse de navigateur).
3. À chaque lancement, elle contacte automatiquement l'API en temps réel pour **charger la dernière adresse officielle active** (ex: `purstream.ad`, `purstream.la`, etc.). Même si Purstream change d'adresse demain, votre application continuera de fonctionner sans avoir besoin de la réinstaller !

---

## 🚀 Comment installer l'application sur vos appareils

Une fois déployé sur Vercel :

### Sur PC / Mac (Google Chrome, Microsoft Edge, Brave) :
1. Ouvrez votre lien Vercel (ex: `https://purstream-redirect.vercel.app`).
2. Dans la barre d'adresse tout à droite, cliquez sur l'icône **« Installer l'application Purstream »** (ou menu `...` > *« Installer Purstream »*).
3. Cliquez sur **Installer**.
4. L'application Purstream s'ouvre dans sa propre fenêtre indépendante et crée un raccourci sur votre Bureau et dans le menu Démarrer !

### Sur Android (Chrome) :
1. Ouvrez le lien sur Chrome.
2. Appuyez sur le menu (les 3 points en haut à droite) > **« Ajouter à l'écran d'accueil »** ou **« Installer l'application »**.
3. L'icône Purstream apparaît parmi vos applications.

### Sur iPhone / iPad (Safari) :
1. Ouvrez le lien dans Safari.
2. Appuyez sur le bouton de partage (icône avec la flèche vers le haut).
3. Sélectionnez **« Sur l'écran d'accueil »**.

---

## 🛠️ Structure technique

- **`public/manifest.json` :** Manifeste Web App avec le thème officiel sombre (`#121118`), les icônes haute résolution et le mode `standalone`.
- **`public/sw.js` :** Service Worker validant les critères d'installation PWA des navigateurs.
- **`public/index.html` :** Conteneur plein écran fluide avec splash screen initial aux couleurs de Purstream.
- **`api/status.js` :** Fonction Vercel Edge qui interroge l'API de monitoring sans blocage CORS et fournit le domaine actif.
- **`api/redirect.js` :** Endpoint alternatif pour ceux qui souhaitent une redirection HTTP 307 brute.
