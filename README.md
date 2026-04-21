# SEOSuite — Guide de déploiement Vercel

Application Next.js connectée en temps réel à Google Search Console, Google Analytics 4 et l'API Claude.

---

## Étape 1 — Créer le projet Google Cloud

1. Allez sur https://console.cloud.google.com
2. Cliquez **"Nouveau projet"** → donnez-lui un nom (ex : `seosuite`)
3. Dans le menu gauche → **API et services** → **Bibliothèque**
4. Activez ces 3 APIs (recherchez chacune) :
   - ✅ **Google Search Console API**
   - ✅ **Google Analytics Data API**
   - ✅ **Google Analytics Admin API**

---

## Étape 2 — Créer les identifiants OAuth

1. **API et services** → **Identifiants** → **+ Créer des identifiants** → **ID client OAuth**
2. Type : **Application Web**
3. Nom : `SEOSuite`
4. **URIs de redirection autorisés**, ajoutez :
   ```
   http://localhost:3000/api/auth/callback/google
   https://VOTRE-APP.vercel.app/api/auth/callback/google
   ```
   *(vous ajouterez l'URL Vercel après le déploiement)*
5. Cliquez **Créer** → notez le **Client ID** et le **Client Secret**

---

## Étape 3 — Déployer sur Vercel

### 3a. Mettre le code sur GitHub

1. Créez un compte GitHub si besoin : https://github.com
2. Créez un nouveau dépôt (bouton **+** → **New repository**)
3. Glissez-déposez le dossier `seosuite` dans l'interface GitHub, ou utilisez :
   ```bash
   cd seosuite
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VOTRE-USER/seosuite.git
   git push -u origin main
   ```

### 3b. Déployer sur Vercel

1. Allez sur https://vercel.com → **Sign up with GitHub**
2. Cliquez **Add New Project** → importez votre dépôt `seosuite`
3. Vercel détecte automatiquement Next.js → cliquez **Deploy**
4. Le premier déploiement va échouer (variables manquantes) — c'est normal

---

## Étape 4 — Configurer les variables d'environnement

Dans Vercel → votre projet → **Settings** → **Environment Variables**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `GOOGLE_CLIENT_ID` | Votre Client ID Google |
| `GOOGLE_CLIENT_SECRET` | Votre Client Secret Google |
| `NEXTAUTH_SECRET` | Une chaîne aléatoire (ex : générez sur https://generate-secret.vercel.app/32) |
| `NEXTAUTH_URL` | `https://VOTRE-APP.vercel.app` |
| `ANTHROPIC_API_KEY` | Votre clé API Anthropic (https://console.anthropic.com) |

Puis cliquez **Redeploy** dans l'onglet Deployments.

---

## Étape 5 — Mettre à jour l'URI de redirection Google

1. Retournez sur Google Cloud → Identifiants → votre Client OAuth
2. Ajoutez dans **URIs de redirection** :
   ```
   https://VOTRE-APP.vercel.app/api/auth/callback/google
   ```
3. Sauvegardez

---

## Étape 6 — Tester

1. Ouvrez `https://VOTRE-APP.vercel.app`
2. Cliquez **Continuer avec Google**
3. Autorisez l'accès (Search Console + Analytics)
4. Vos données apparaissent en temps réel !

---

## Structure du projet

```
seosuite/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js   ← OAuth Google
│   │   ├── gsc/route.js                  ← API Search Console
│   │   ├── ga4/route.js                  ← API Google Analytics 4
│   │   └── llm/route.js                  ← API Claude (streaming)
│   ├── dashboard/page.js                 ← Page principale
│   ├── login/page.js                     ← Page de connexion
│   └── layout.js
├── components/
│   ├── Sidebar.js
│   ├── Topbar.js                         ← Sélecteur de site / propriété
│   ├── PositionsPage.js                  ← Données GSC réelles
│   ├── TraficPage.js                     ← Données GA4 réelles
│   ├── OpportunitesPage.js               ← Détection automatique
│   ├── OptimiserPage.js                  ← Quick wins positions 11-30
│   ├── LLMPage.js                        ← Claude en streaming live
│   └── ui.js                             ← Composants partagés
├── .env.local.example                    ← Template des variables
└── README.md
```

---

## Développement local

```bash
cp .env.local.example .env.local
# Remplissez .env.local avec vos vraies valeurs

npm install
npm run dev
# Ouvrez http://localhost:3000
```

---

## Problèmes fréquents

**"Access blocked" lors de la connexion Google**
→ Votre app est en mode "test". Allez dans Google Cloud → Écran de consentement OAuth → ajoutez votre email en **Utilisateurs test**.

**Les données GSC/GA4 ne s'affichent pas**
→ Vérifiez que vous avez bien les droits sur la propriété Search Console (accès "Propriétaire" ou "Utilisateur complet").

**Erreur 500 sur /api/gsc**
→ Vérifiez que les 3 APIs Google sont bien activées dans Google Cloud.
