# Portfolio avec base de données (Supabase + GitHub Pages)

Architecture :
- **GitHub Pages** : héberge le site (fichiers HTML, CSS, JS).
- **Supabase** : base de données PostgreSQL, authentification (votre compte admin) et stockage des images.
- **admin.html** : page de gestion. Vous vous connectez et vos modifications sont enregistrées dans la base.

## Étape 1 : créer le projet Supabase (gratuit)
1. Allez sur https://supabase.com, créez un compte, puis **New project**.
2. Donnez un nom (ex. `portfolio`), choisissez un mot de passe pour la base, une région proche (ex. Europe), puis **Create**. Attendez 1 à 2 minutes.

## Étape 2 : créer la base de données
1. Dans Supabase : **SQL Editor → New query**.
2. Copiez tout le contenu de `sql/schema.sql`, collez-le, puis **Run**.
   Un message « Success » doit apparaître.

## Étape 3 : créer votre compte administrateur
1. **Authentication → Users → Add user → Create new user**.
2. Email : `yassineoulhaj22@gmail.com`, choisissez un mot de passe fort, puis **Create user**.
3. Pour empêcher toute inscription publique : **Authentication → Sign In / Providers → Email**, décochez **Allow new users to sign up**.

## Étape 4 : relier le site à la base
1. **Project Settings → API**.
2. Copiez **Project URL** et la clé **anon public**.
3. Ouvrez `js/config.js` et remplacez `SUPABASE_URL` et `SUPABASE_ANON_KEY`.
   La clé « anon » peut être publique. Ne mettez jamais la clé « service_role ».

## Étape 5 : publier sur GitHub
1. Créez un dépôt public `portfolio` sur github.com.
2. Téléversez tous les fichiers de ce dossier (**Add file → Upload files**).
3. **Settings → Pages → Deploy from a branch → main, / (root) → Save**.
4. Le site est en ligne à `https://yassineoulhaj22-stack.github.io/portfolio/`.
5. La page de gestion est à `https://yassineoulhaj22-stack.github.io/portfolio/admin.html`.

## Utiliser la page de gestion
1. Ouvrez `admin.html`, connectez-vous avec votre email et votre mot de passe.
2. Modifiez le profil puis cliquez sur **Enregistrer le profil**.
3. Pour chaque parcours, compétence ou projet : modifiez, puis **Enregistrer**.
4. **+ Ajouter** crée un élément. **Supprimer** le retire définitivement.
5. Pour une image : **Téléverser** envoie le fichier, son adresse est remplie automatiquement, puis **Enregistrer**.
6. Pour masquer un projet sans le supprimer, décochez **Publié**.

## Fichiers
```
index.html          Site public (lit la base)
admin.html          Gestion (connexion requise)
sql/schema.sql      Création des tables et des règles de sécurité
js/config.js        Vos identifiants Supabase (à remplir une fois)
js/db.js            Connexion à la base
js/site.js          Affichage du site
js/admin.js         Logique de la page de gestion
css/                Styles
assets/             Photo et CV de départ (les nouvelles images vont dans le stockage Supabase)
```

## Sécurité
- Seul le compte `yassineoulhaj22@gmail.com` peut modifier les données, grâce aux règles RLS du fichier `schema.sql`.
- Le site public peut seulement lire les données.
- Si vous changez d'email admin, modifiez-le dans `schema.sql` (5 endroits) et dans `js/config.js`.

## Applications (APK) et CV
**Ajouter le CV** : admin.html → Profil → « Téléverser le fichier du CV (PDF) ». Le lien « Télécharger mon CV » apparaît sur le site.

**Ajouter une application** : Applications → **+ Ajouter une application**, renseignez le nom, la version, la description, puis téléversez le fichier `.apk` (50 Mo maximum via Supabase).
Pour un APK plus lourd, créez une **Release** sur GitHub (votre dépôt → Releases → Create a new release → joignez le `.apk`), puis collez le lien du fichier dans « Lien de téléchargement ».

**Installation Android** : l'utilisateur doit autoriser l'installation depuis une source inconnue (le navigateur le lui demande). Pour un usage public, une application sur le Play Store est plus rassurante.

**Base de données** : pour une base existante, exécutez `sql/add_apps.sql` une seule fois dans le SQL Editor.

## Mode Public / Privé
**Mise en place (une fois)** : exécutez `sql/privacy.sql` dans le SQL Editor de Supabase.

**Configurer la connexion par email** (sinon le lien de connexion ne fonctionnera pas) :
1. Supabase → **Authentication → URL Configuration**.
2. *Site URL* : l'adresse de votre site, par exemple `https://yassineoulhaj22-stack.github.io/portfolio2/`.
3. *Redirect URLs* : ajoutez la même adresse.
4. Supabase → **Authentication → Sign In / Providers → Email** : laissez *Confirm email* activé, mais désactivez *Allow new users to sign up* si vous voulez limiter les comptes. Pour le mode privé, les visiteurs doivent pouvoir recevoir un lien : dans ce cas, gardez la création de compte automatique.

**Utilisation** : admin.html → **Visibilité du portfolio** :
- *Public* : tout le monde voit le site.
- *Privé* : le visiteur saisit son email, reçoit un lien, puis envoie une demande. Vous voyez la demande dans admin.html et vous l'acceptez après avoir vérifié qu'il vous suit.

**Limites à connaître** :
- La vérification de l'abonnement reste manuelle : aucun système gratuit ne peut la faire automatiquement.
- Les images et le CV, stockés dans le bucket public, restent accessibles à qui possède leur adresse exacte. Pour les protéger aussi, il faudrait un bucket privé avec des liens temporaires.
