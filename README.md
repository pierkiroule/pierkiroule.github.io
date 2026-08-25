# pierkiroule.github.io

Site statique personnel, déployable directement depuis la racine du dépôt.

## Déploiement Vercel

Le projet ne nécessite ni commande de build ni dossier de sortie : Vercel sert
directement les fichiers versionnés. Dans les réglages du projet Vercel :

- laisser **Framework Preset** sur `Other` ;
- laisser **Build Command** et **Output Directory** vides ;
- laisser **Root Directory** à la racine du dépôt.

La racine contient désormais un véritable fichier `index.html`, servi
automatiquement par Vercel sans règle de réécriture. Il redirige vers la page du
jeu `sourcier/silentbird.html`. Les autres fichiers statiques restent accessibles
normalement.
