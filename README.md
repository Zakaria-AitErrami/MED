# Plateforme MICI - Suivi intelligent des patients

Prototype web pour le suivi à distance des patients MICI (Crohn et RCH), avec:

- dashboard médecin avec priorisation vert / orange / rouge;
- connexion médecin par email / mot de passe de démonstration;
- interface bilingue français / arabe avec affichage RTL en arabe;
- création de patient avec nom, prénom, téléphone et code unique générable;
- recherche par nom, prénom, code ou téléphone avec pagination;
- fiche patient avec courbes, score clinique, traitements et timeline;
- espace patient avec connexion par code fourni par le médecin;
- feedback immédiat patient;
- messagerie médecin → patient;
- adaptateur Supabase pour utiliser une base PostgreSQL distante.

## Lancer localement

Ouvre `index.html` dans un navigateur, ou lance un petit serveur statique:

```bash
python3 -m http.server 5173
```

Puis visite `http://localhost:5173`.

Identifiants médecin par défaut:

```text
Email: medecin@mici.local
Mot de passe: demo1234
```

Ces identifiants ne sont pas affichés dans l’interface.

## Brancher une base distante Supabase

1. Crée un projet sur Supabase.
2. Ouvre le SQL Editor.
3. Colle et exécute `database.sql`.
4. Dans Supabase, copie `Project URL` et `anon public key`.
5. Mets ces deux valeurs dans `config.js`.
6. Recharge la page.

Le prototype utilise l’API REST Supabase directement depuis le navigateur.
Le dashboard ne demande plus l’URL ou la clé.

Exemple:

```js
window.MICI_CONFIG = {
  supabaseUrl: "https://your-project.supabase.co",
  supabaseAnonKey: "your-anon-public-key",
  doctor: {
    email: "medecin@example.com",
    password: "change-this-demo-password",
  },
  showDemoHelpers: false,
};
```

## Déployer sur Netlify pour un MVP de test

1. Mets à jour Supabase.
   - Si tu avais déjà exécuté l’ancien script, exécute seulement `migration_existing_supabase.sql`.
   - Si c’est une nouvelle base, exécute `database.sql`.

2. Dans Supabase, vérifie que l’API REST est accessible avec l’`anon public key`.

3. Dans Netlify, crée un nouveau site depuis ce dossier ou depuis ton repo Git.

4. Ajoute ces variables dans `Site configuration` → `Environment variables`:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
DOCTOR_EMAIL=medecin@mici.local
DOCTOR_PASSWORD=demo1234
SHOW_DEMO_HELPERS=false
```

5. Déploie. Netlify va exécuter:

```bash
node scripts/create-config.mjs
```

Cela génère `config.js` au moment du build. Tu n’as donc pas besoin de saisir l’URL Supabase ou la clé dans le dashboard.

6. Test rapide après déploiement:
   - bascule FR/AR sur l’écran de connexion;
   - connexion médecin avec l’email/mot de passe définis;
   - ajout d’un patient avec code généré;
   - recherche par nom, téléphone ou code;
   - connexion patient avec le code généré;
   - envoi d’un questionnaire;
   - vérification que le patient ne voit que son espace.

## Important avant production

Ce prototype est une base fonctionnelle, pas une application médicale prête à déployer. Avant un usage réel avec données de santé, il faut ajouter:

- authentification forte médecin/patient avec Supabase Auth ou backend dédié;
- règles RLS strictes par rôle et par patient, pas seulement une restriction frontend;
- chiffrement, audit logs et traçabilité;
- consentement patient et politique de conservation des données;
- validation médicale du score clinique;
- backend serveur pour éviter d’exposer une logique sensible côté client.

Pour un test MVP, partage les codes patient uniquement aux personnes concernées. Le mot de passe médecin reste une protection de démonstration côté navigateur, pas une sécurité médicale réelle.
