# 🚀 Purstream Auto-Redirect (Vercel Edge)

Projet léger et ultra-rapide conçu pour être déployé sur **Vercel**. Dès qu'un utilisateur visite votre lien (ex: `https://mon-purstream.vercel.app`), il est **redirigé instantanément vers la dernière URL officielle active** de Purstream sans intervention manuelle.

---

## ⚡ Comment ça marche ?

1. Une fonction **Vercel Edge** (`api/index.js`) interroge l'API de monitoring en temps réel de `https://purstream.wiki/api/server-status`.
2. Elle extrait l'URL active du serveur principal (`id: "main"`).
3. Elle renvoie immédiatement une redirection HTTP **307 (Temporary Redirect)** vers le bon domaine (ex: `https://purstream.ad/`).
4. Si l'API est indisponible, un fallback automatique renvoie vers `https://purstream.wiki/`.
5. Aucun cache n'est conservé (`no-store, no-cache`) pour garantir que chaque clic obtienne toujours le domaine le plus récent.

---

## 🌐 Déploiement sur Vercel

### Méthode 1 — Via GitHub Desktop & Vercel Dashboard (Recommandé)
1. Ouvrez **GitHub Desktop**.
2. Allez dans **File** > **Add Local Repository...** et sélectionnez ce dossier (`purstream-redirect`).
3. Cliquez sur **Publish repository** pour envoyer le code sur votre compte GitHub.
4. Rendez-vous sur votre tableau de bord [Vercel](https://vercel.com).
5. Cliquez sur **Add New...** > **Project** et importez le dépôt GitHub `purstream-redirect`.
6. Cliquez sur **Deploy** (aucune variable d'environnement requise).

### Méthode 2 — Via la CLI Vercel
Dans un terminal ouvert dans ce dossier :
```bash
npx vercel
```
Appuyez sur Entrée pour valider les options par défaut.

---

## 📱 Utilisation

Une fois déployé, Vercel vous donne une URL du type :
> `https://purstream-redirect-xxx.vercel.app`

Il vous suffit de mettre cette URL en **favori** sur votre téléphone ou ordinateur : vous n'aurez plus jamais à chercher la nouvelle adresse manuellement !
