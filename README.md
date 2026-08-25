# pierkiroule.github.io

Site statique personnel, déployable directement depuis la racine du dépôt.

## Déploiement Vercel

Le projet ne nécessite ni commande de build ni dossier de sortie : Vercel sert
directement les fichiers versionnés. Dans les réglages du projet Vercel :

- laisser **Framework Preset** sur `Other` ;
- laisser **Build Command** et **Output Directory** vides ;
- laisser **Root Directory** à la racine du dépôt.

Le fichier `vercel.json` réécrit explicitement la racine `/` vers la page du
jeu `/sourcier/silentbird.html`, tout en laissant Vercel servir normalement les
autres fichiers statiques.
