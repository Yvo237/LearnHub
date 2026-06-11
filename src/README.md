# LearnHub - Learning Management System (LMS)

## Description

LearnHub est une plateforme d'apprentissage en ligne complete et moderne, construite avec React, TypeScript, Vite et Tailwind CSS. Cette application offre une experience utilisateur fluide et professionnelle pour la gestion de cours en ligne, le suivi de progression, les quiz interactifs et bien plus encore.

### Fonctionnalites principales

- **Authentification obligatoire** : Inscription et connexion via Supabase
- **Mode sombre/clair** : Theme applique sur TOUTE l'application avec persistance
- **Bilingue (FR/EN)** : Interface complete en francais et anglais
- **Integration Supabase** : Backend-as-a-Service pour l'authentification et la base de donnees

---

## Table des matieres

1. [Technologies utilisees](#technologies-utilisees)
2. [Architecture du projet](#architecture-du-projet)
3. [Fonctionnalites](#fonctionnalites)
4. [Pages de l'application](#pages-de-lapplication)
5. [Structure des donnees](#structure-des-donnees)
6. [Composants](#composants)
7. [Points forts](#points-forts)
8. [Installation et demarrage](#installation-et-demarrage)
9. [Scripts disponibles](#scripts-disponibles)

---

## Technologies utilisees

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 19.2.6 | Bibliotheque UI principale |
| **TypeScript** | 5.9.3 | Typage statique |
| **Vite** | 7.3.2 | Build tool et serveur de developpement |
| **Tailwind CSS** | 4.1.17 | Framework CSS utilitaire |
| **Lucide React** | - | Bibliotheque d'icones |
| **Supabase** | - | Backend-as-a-Service (Auth, Database, Storage) |

---

## Architecture du projet

```
src/
├── components/
│   ├── auth/
│   │   └── AuthPage.tsx         # Page de connexion/inscription
│   ├── layout/
│   │   ├── Sidebar.tsx          # Navigation laterale responsive
│   │   └── Header.tsx           # Barre superieure avec recherche et notifications
│   └── pages/
│       ├── Dashboard.tsx        # Tableau de bord principal
│       ├── Catalog.tsx          # Catalogue des cours
│       ├── MyCourses.tsx        # Mes cours inscrits
│       ├── CourseDetail.tsx     # Detail d'un cours
│       ├── LessonView.tsx       # Vue d'une lecon
│       ├── QuizPage.tsx         # Interface de quiz
│       ├── Certificates.tsx     # Certificats obtenus
│       ├── CalendarPage.tsx     # Calendrier des evenements
│       ├── Forum.tsx            # Forum de discussion
│       ├── Leaderboard.tsx      # Classement des apprenants
│       ├── Profile.tsx          # Profil utilisateur
│       └── Settings.tsx         # Parametres du compte
├── contexts/
│   └── AppContext.tsx           # Contexte global (theme, langue, auth)
├── i18n/
│   └── translations.ts          # Traductions FR/EN
├── lib/
│   └── supabase.ts              # Client et services Supabase
├── data/
│   └── mockData.ts              # Donnees de demonstration
├── store/
│   └── useStore.ts              # Gestion d'etat de navigation
├── types/
│   └── index.ts                 # Definitions TypeScript
├── utils/
│   └── cn.ts                    # Utilitaire pour les classes CSS
├── App.tsx                      # Composant racine
├── main.tsx                     # Point d'entree avec providers
└── index.css                    # Styles globaux et variables de theme
```

---

## Fonctionnalites

### Gestion des cours

- **Catalogue complet** : Parcourir tous les cours disponibles
- **Filtrage avance** : Par categorie, niveau, prix
- **Tri multiple** : Popularite, note, date, prix
- **Recherche** : Recherche en temps reel par titre, tags ou instructeur
- **Inscription** : Systeme d'inscription aux cours (gratuits et payants)

### Apprentissage

- **Modules et lecons** : Structure hierarchique du contenu
- **Types de contenu** : Video, article, quiz, exercice pratique
- **Progression** : Suivi automatique de la progression
- **Notes personnelles** : Prise de notes pendant les lecons
- **Verrouillage** : Lecons verrouillees jusqu'a completion des precedentes

### Quiz interactifs

- **Questions a choix multiples** : Interface intuitive
- **Feedback immediat** : Verification instantanee des reponses
- **Explications** : Explication detaillee apres chaque question
- **Score final** : Calcul du pourcentage de reussite
- **Seuil de reussite** : Validation selon un score minimum

### Gamification

- **Points XP** : Accumulation de points d'experience
- **Badges** : Recompenses pour accomplissements
- **Serie de jours** : Suivi de la constance d'apprentissage
- **Classement** : Comparaison avec les autres apprenants
- **Certificats** : Attestations de completion des cours

### Communication

- **Forum de discussion** : Echanges entre apprenants par cours
- **Notifications** : Alertes pour deadlines, reponses, nouveautes
- **Calendrier** : Vue des evenements, lives et deadlines

### Personnalisation

- **Profil utilisateur** : Informations et statistiques
- **Parametres** : Notifications, securite, preferences
- **Theme sombre/clair** : Basculement instantane avec persistance
- **Multilingue** : Interface en francais et anglais

### Integration Supabase

- **Authentification** : Inscription, connexion, deconnexion
- **Base de donnees** : Stockage des cours, progressions, certificats
- **Temps reel** : Mise a jour automatique des donnees
- **Securite** : Row Level Security (RLS) pour la protection des donnees

---

## Pages de l'application

### 1. Dashboard (Tableau de bord)

Le point d'entree de l'application affiche :
- Message de bienvenue personnalise
- Statistiques globales (cours, lecons, certificats, points)
- Cours en cours avec progression
- Activite hebdomadaire (graphique)
- Evenements a venir
- Recommandations de cours

### 2. Catalogue

Page de decouverte des cours avec :
- Grille de cartes de cours
- Onglets de categories
- Filtres (niveau, prix)
- Options de tri
- Indicateur d'inscription
- Preview de progression pour cours inscrits

### 3. Mes Cours

Gestion des cours auxquels l'utilisateur est inscrit :
- Barre de progression globale
- Statistiques de completion
- Filtres (tous, en cours, termines)
- Acces rapide a la prochaine lecon
- Indicateur de progression par cours

### 4. Detail du Cours

Page complete d'un cours incluant :
- Hero avec informations principales
- Statistiques (note, etudiants, duree)
- Bouton d'inscription ou de continuation
- Onglets : Contenu, Apercu, Forum, Avis
- Liste des modules et lecons
- Indicateur de completion par lecon

### 5. Vue Lecon

Interface d'apprentissage immersive :
- Lecteur video avec controles
- Contenu article avec mise en forme
- Zone de notes personnelles
- Navigation entre lecons
- Sidebar avec arborescence du cours
- Bouton de completion

### 6. Quiz

Systeme de quiz complet :
- Ecran d'introduction avec regles
- Questions une par une
- Selection de reponse
- Verification et explication
- Barre de progression
- Ecran de resultats avec score

### 7. Certificats

Galerie de certificats obtenus :
- Statistiques de certifications
- Cartes visuelles de certificats
- Informations : cours, note, date
- Actions : telecharger, partager

### 8. Calendrier

Vue mensuelle et liste des evenements :
- Navigation entre mois
- Types : deadline, live, examen, rappel
- Selection d'un jour pour details
- Legende des couleurs
- Vue liste alternative

### 9. Forum

Espace de discussion communautaire :
- Filtrage par cours
- Recherche de discussions
- Tri (recent, populaire)
- Compteurs de likes et reponses
- Creation de nouvelle discussion

### 10. Classement

Tableau des meilleurs apprenants :
- Position de l'utilisateur mise en avant
- Podium visuel (top 3)
- Liste complete avec rang
- Points, cours et serie de jours

### 11. Profil

Page personnelle de l'utilisateur :
- Avatar et informations
- Statistiques detaillees
- Graphique de competences
- Heatmap d'activite (30 jours)
- Badges obtenus
- Cours en cours

### 12. Parametres

Configuration du compte :
- Profil : nom, email, bio, avatar
- Notifications : email, push, digest
- Securite : mot de passe, 2FA
- Preferences : langue, fuseau horaire

---

## Structure des donnees

### Types principaux

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  coursesCompleted: number;
  totalPoints: number;
  streak: number;
  badges: Badge[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: 'Debutant' | 'Intermediaire' | 'Avance';
  duration: string;
  totalLessons: number;
  rating: number;
  price: number;
  isFree: boolean;
  modules: Module[];
  isEnrolled?: boolean;
  progress?: number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'exercise';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Quiz {
  id: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
}
```

### Donnees de demonstration

L'application inclut des donnees realistes :
- **8 cours** dans diverses categories
- **1 utilisateur** avec progression
- **3 certificats** obtenus
- **7 evenements** de calendrier
- **4 discussions** de forum
- **10 apprenants** dans le classement

---

## Composants

### Layout

| Composant | Description |
|-----------|-------------|
| `Sidebar` | Navigation principale responsive, mode reduit, carte de serie |
| `Header` | Recherche globale, notifications, toggle theme, avatar utilisateur |

### Pages

| Composant | Lignes | Fonctionnalites |
|-----------|--------|-----------------|
| `Dashboard` | ~220 | Stats, cours, activite, evenements |
| `Catalog` | ~180 | Grille, filtres, tri, recherche |
| `MyCourses` | ~150 | Liste, progression, filtres |
| `CourseDetail` | ~430 | Hero, modules, onglets, inscription |
| `LessonView` | ~220 | Lecteur, notes, navigation |
| `QuizPage` | ~250 | Questions, validation, resultats |
| `Certificates` | ~120 | Galerie, actions |
| `CalendarPage` | ~200 | Vue mois, evenements, legende |
| `Forum` | ~130 | Discussions, recherche, tri |
| `Leaderboard` | ~140 | Podium, classement complet |
| `Profile` | ~215 | Stats, competences, badges, activite |
| `Settings` | ~230 | Formulaires, toggles, sections |

---

## Points forts

### Design

- **Interface moderne** : Design epure avec gradients et ombres subtiles
- **Responsive** : Adapte a mobile, tablette et desktop
- **Accessibilite** : Contraste suffisant, navigation clavier
- **Animations** : Transitions fluides et feedbacks visuels

### Architecture

- **Composants modulaires** : Reutilisation maximale
- **TypeScript strict** : Typage complet des donnees
- **Separation des concerns** : Types, data, store, composants
- **Code maintenable** : Structure claire et documentee

### Performance

- **Vite** : Build rapide et HMR instantane
- **Tailwind CSS** : CSS optimise et purge automatique
- **Single file** : Bundle unique pour le deploiement

### UX/UI

- **Navigation intuitive** : Sidebar claire et breadcrumbs
- **Feedback utilisateur** : Etats de chargement et confirmations
- **Filtrage en temps reel** : Resultats instantanes
- **Progression visible** : Barres et pourcentages partout

---

## Integration Supabase

### Configuration

L'application est connectee a Supabase pour la gestion des donnees. Les identifiants sont configures dans `src/lib/supabase.ts`.

### Services disponibles

| Service | Description |
|---------|-------------|
| `authService` | Authentification (signup, signin, signout) |
| `courseService` | Gestion des cours et inscriptions |
| `lessonService` | Progression et notes des lecons |
| `quizService` | Soumission et historique des quiz |
| `certificateService` | Generation et recuperation des certificats |
| `userService` | Profil utilisateur et preferences |
| `forumService` | Discussions et likes |
| `leaderboardService` | Classement des utilisateurs |
| `calendarService` | Evenements et rappels |

### Schema de base de donnees

```sql
-- Tables principales
profiles          -- Profils utilisateurs
courses           -- Cours disponibles
modules           -- Modules de cours
lessons           -- Lecons individuelles
enrollments       -- Inscriptions aux cours
lesson_progress   -- Progression des lecons
quiz_attempts     -- Tentatives de quiz
certificates      -- Certificats obtenus
forum_posts       -- Discussions du forum
calendar_events   -- Evenements du calendrier
```

---

## Systeme de theme (Dark/Light)

### Fonctionnement

1. Le theme est stocke dans `localStorage` avec la cle `learnhub-theme`
2. Au chargement, le systeme detecte les preferences systeme si aucun choix n'est sauve
3. La classe `dark` est ajoutee/retiree sur `document.documentElement`
4. Les variables CSS changent automatiquement

### Variables CSS

```css
:root {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --text-primary: #0f172a;
  --border-color: #e2e8f0;
}

.dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --border-color: #334155;
}
```

---

## Systeme de traduction (i18n)

### Langues supportees

- **Francais (fr)** : Langue par defaut
- **Anglais (en)** : Langue alternative

### Utilisation

```typescript
import { useApp } from './contexts/AppContext';

function MyComponent() {
  const { t, language, setLanguage } = useApp();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  );
}
```

### Ajout de traductions

Les traductions sont definies dans `src/i18n/translations.ts` :

```typescript
export const translations = {
  'nav.dashboard': {
    fr: 'Tableau de bord',
    en: 'Dashboard',
  },
  // ...
};
```

---

## Installation et demarrage

### Prerequis

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd learnhub

# Installer les dependances
npm install
```

### Demarrage

```bash
# Mode developpement
npm run dev

# L'application sera disponible sur http://localhost:5173
```

### Build de production

```bash
# Construire pour la production
npm run build

# Previsualiser le build
npm run preview
```

---

## Scripts disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| `dev` | `npm run dev` | Demarre le serveur de developpement |
| `build` | `npm run build` | Construit l'application pour la production |
| `preview` | `npm run preview` | Previsualise le build de production |

---

## Specifications techniques

### Navigateurs supportes

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Resolution minimale

- Mobile : 320px
- Tablette : 768px
- Desktop : 1024px

### Taille du bundle

- HTML final : ~375 KB
- Gzip : ~98 KB

---

## Conclusion

LearnHub est une application LMS complete et fonctionnelle, prete a etre etendue avec :
- Integration backend (API REST)
- Authentification reelle
- Base de donnees
- Paiements en ligne
- Streaming video

L'architecture modulaire permet d'ajouter facilement de nouvelles fonctionnalites tout en maintenant la qualite du code.
