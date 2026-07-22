# Portfolio — Dimitri Nelson Baliguini Demba

Portfolio professionnel avec panel d'administration complet, permettant une gestion autonome des projets, articles de blog, statistiques de visite et newsletter — sans intervention sur le code.

**Site en ligne :** https://baliguini-portfolio.vercel.app

## Stack technique

- **Frontend** : React 19, Vite, Tailwind CSS 4, React Router 7
- **Backend / données** : Supabase (PostgreSQL, Auth, Storage)
- **IA** : Groq (génération assistée de descriptions de projet)
- **Emails transactionnels** : Resend
- **Hébergement** : Vercel (frontend + fonctions serverless + tâches planifiées)

## Fonctionnalités

### Partie publique
- Page d'accueil : hero personnalisable, projets phares, derniers articles, sections À propos et Contact
- Liste de projets filtrable par catégorie, page de détail complète
- Blog avec rendu Markdown, temps de lecture, articles liés
- Newsletter (inscription sur les pages d'articles)
- SEO : balises meta dynamiques, sitemap généré automatiquement, données structurées JSON-LD

### Panel d'administration
- Authentification sécurisée (Supabase Auth, compte unique)
- CRUD complet sur les projets et les articles, avec duplication rapide
- Upload d'images sécurisé (validation du type de fichier réel, nommage UUID)
- Réglages du site éditables (photo, bio, liens sociaux, sections À propos/Contact)
- Statistiques de visite (visiteurs uniques, vues par page, temps de lecture, classements)
- Génération de description de projet assistée par IA (Groq)
- Publication programmée des articles (tâche planifiée Vercel)
- Export CSV des inscrits newsletter

## Sécurité

- Row Level Security (RLS) activé sur toutes les tables Supabase dès leur création
- Lecture publique strictement limitée au contenu publié (jamais les brouillons)
- Écriture réservée à l'unique compte administrateur authentifié
- Validation des entrées côté client et côté base de données (contraintes SQL)
- Vérification du type réel des fichiers uploadés (signature binaire, pas seulement l'extension)
- Aucune clé secrète exposée côté client — les opérations sensibles (IA, emails, publication automatique) passent par des fonctions serverless

## Installation locale

```bash
git clone https://github.com/Baliguini-dimi/baliguini-portfolio.git
cd baliguini-portfolio
npm install
```

Crée un fichier `.env` à la racine avec :

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

```bash
npm run dev
```

## Structure du projet

src/
components/ composants reutilisables (layout, projets, blog, admin, seo)
pages/ pages publiques et admin
lib/ acces aux donnees et logique metier (Supabase, validation, IA...)
hooks/ hooks personnalises (analytics)
context/ contexte d'authentification
api/ fonctions serverless Vercel (sitemap, IA, emails, publication programmee)


## Auteur

**Dimitri Nelson Baliguini Demba** — Développeur Web & Mobile, Abidjan, Côte d'Ivoire

- GitHub : [@Baliguini-dimi](https://github.com/Baliguini-dimi)
- LinkedIn : [Dimitri Nelson Baliguini Demba](https://www.linkedin.com/in/dimitri-nelson-baligini-demba-4b17b32ba)