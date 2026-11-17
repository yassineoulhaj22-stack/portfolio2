# Portfolio de Yassine Oulhaj

Site statique : HTML, CSS et JavaScript. Aucune installation, gratuit avec GitHub Pages.

## Structure
```
index.html        Page du portfolio (ne pas modifier, sauf le design)
admin.html        Page de gestion : ajouter, modifier, supprimer les projets et les infos
js/data.js        LE CONTENU du site (généré par admin.html)
js/site.js        Affichage du site
js/admin.js       Logique de la page de gestion
css/style.css     Style du site
css/admin.css     Style de la page de gestion
assets/           Vos images : photo, CV (PDF), captures des projets
```

## Modifier votre contenu, sans coder
1. Ouvrez `admin.html` dans votre navigateur (double-clic sur le fichier).
2. Modifiez vos informations : profil, parcours, compétences, projets.
   - **Ajouter** : bouton « + Ajouter un projet » (ou parcours, compétences).
   - **Supprimer** : bouton « Supprimer » sur l'élément.
   - **Réordonner** : boutons ▲ ▼.
3. Cliquez sur **Télécharger data.js**.
4. Sur GitHub, ouvrez votre dépôt, cliquez sur **Add file → Upload files**, puis déposez `data.js`.
   Il remplace l'ancien fichier. Validez avec **Commit changes**.
5. Attendez 1 à 2 minutes puis rechargez votre site.

## Ajouter des images
Déposez vos images dans `assets/projects/` (ou `assets/`) avec **Add file → Upload files**,
puis indiquez leur chemin dans la page de gestion, par exemple `assets/projects/mon-projet.png`.
Pour le CV, déposez `cv.pdf` dans `assets/` et indiquez `assets/cv.pdf` dans le champ « CV ».

## Champs particuliers
- **Listes** (problèmes, solutions, lois) : une ligne par élément.
- **Galerie** : une ligne par image, au format `chemin | légende`.
- **Liens** : une ligne par lien, au format `libellé | https://…`.
- **Compétences** : séparées par des virgules.

## Publier sur GitHub Pages
1. Créez un compte sur github.com, puis un dépôt public (par exemple `portfolio`).
2. Téléversez tous les fichiers du dossier (**Add file → Upload files**), ou utilisez Git :
   `git init`, `git add .`, `git commit -m "Portfolio"`, `git remote add origin …`, `git push`.
3. Dépôt → **Settings → Pages** → **Deploy from a branch** → branche `main`, dossier `/ (root)` → **Save**.
4. Votre site est en ligne à `https://votre-pseudo.github.io/portfolio/`.

## Partager
- Lien dans votre profil LinkedIn (section « Coordonnées » et « Featured »).
- Lien sur votre CV, dans votre signature email, et pendant les entretiens.

## Remarque
`admin.html` ne modifie rien sur le site directement : il produit un fichier que vous téléversez.
Pour une vraie publication sans téléchargement, il faudrait un service de gestion de contenu (CMS) avec connexion ;
c'est une étape possible si vous le souhaitez.
