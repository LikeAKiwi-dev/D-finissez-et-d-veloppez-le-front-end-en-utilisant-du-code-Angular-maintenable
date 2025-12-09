# Olympic Dashboard – Angular Application

Application Angular permettant de visualiser les données des Jeux Olympiques :

- Dashboard global
- Graphique des médailles par pays
- Page détail d’un pays
- Évolution des médailles dans le temps

---

## 1. Installation

### Prérequis
- Node.js ≥ 18
- Angular CLI ≥ 17

### Installation des dépendances
``npm install``

### Lancement du projet
``ng serve``


L'application sera disponible sur :
http://localhost:4200

---

## 2. Structure du projet

Le projet suit une architecture claire, inspirée du style guide Angular.

```
src/app/
├── pages/
│ ├── home/
│ │ ├── home.component.ts
│ │ ├── home.component.html
│ │ └── home.component.scss
│ ├── country/
│ │ ├── country.component.ts
│ │ ├── country.component.html
│ │ └── country.component.scss
│ └── not-found/
│ ├── not-found.component.ts
│ └── not-found.component.html
│
├── components/
│ ├── medal-chart/
│ │ ├── medal-chart.component.ts
│ │ ├── medal-chart.component.html
│ │ └── medal-chart.component.scss
│ └── country-card/
│ ├── country-card.component.ts
│ ├── country-card.component.html
│ └── country-card.component.scss
│
├── services/
│ └── data.service.ts
│
├── models/
│ ├── olympic.model.ts
│ └── participation.model.ts
│
├── app-routing.module.ts
└── app.component.ts
```

---

## 3. Fonctionnalités

### Dashboard (Home)
- Titre et texte introductif
- Nombre total de pays
- Nombre total de participations
- Pie chart (Chart.js)
- Navigation au clic vers la page détail d’un pays

### Page Détail (Country)
- KPIs : total médailles, total athlètes, nombre de participations
- Courbe d’évolution des médailles
- Bouton retour
- Gestion des erreurs :
  - ID invalide
  - Pays introuvable
  - Redirection vers Not Found

### Page Not Found
- Message d’erreur clair
- Activée sur mauvaise URL ou ID invalide

---

## 4. Technologies utilisées

- Angular 17
- TypeScript (zéro any)
- Chart.js pour les graphiques
- Observables & HttpClient
- Architecture modulaire (pages / components / services / models)

---

## 5. Qualité du code

- Aucun console.log
- Aucun any
- Code lisible et structuré
- Observables détruits si nécessaire
- Composants réutilisables
- Architecture documentée dans ARCHITECTURE.md

---

## 6. Données

Les données proviennent du fichier JSON :
``assets/mock/olympic.json``


Le DataService centralise :
- la récupération des données,
- la recherche par ID.

---

## 7. Limites actuelles

- Données statiques (mock JSON)
- Aucune API externe pour le moment
- Style minimaliste pour laisser la priorité à la structure Angular

---

## 8. Auteur

Projet réalisé par **Jordan Chatel**  
Parcours : Développeur Full-Stack Angular / Java – OpenClassrooms


