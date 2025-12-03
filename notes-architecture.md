# Étape 1 – Analyse du code existant

## 1. Structure générale du projet

- Les composants sont rangés dans `src/app/pages`.
- Aucun dossier `services`, `core` ou `shared`.  
  Toute la logique métier, la récupération des données et les calculs sont réalisés dans les composants, ce qui réduit la maintenabilité.

**Exemple (src/app/pages/home/home.component.ts)**  
private olympicUrl = './assets/mock/olympic.json';  
ngOnInit() {  
this.http.get<any[]>(this.olympicUrl).subscribe(data => { ... });  
}

**Risques :**
- duplication de code,
- faible testabilité,
- difficile à remplacer par une API réelle,
- forte dépendance des composants aux sources de données.

**Amélioration :** créer un `DataService`.

Les composants actuels ont trop de responsabilités :
- `home.component.ts` : HTTP, calculs, graphiques, navigation.
- `country.component.ts` : HTTP, filtrage, calculs, graphiques.

---

## 2. Analyse du HomeComponent

Fichier : `src/app/pages/home/home.component.ts`

### Appels HTTP dans le composant
ngOnInit() {  
this.http.get<any[]>(this.olympicUrl).subscribe(...);  
}  
→ Devrait être déplacé dans un service.

### Usage massif du type `any`
Exemples :  
data.map((i: any) => i.country)  
i.participations.map((p: any) => p.medalsCount)

Interfaces attendues :
- `Participation` : id, year, city, medalsCount, athleteCount
- `Olympic` : id, country, participations[]

### Console.log inutiles
console.log(JSON.stringify(data))  
→ À retirer.

### Gestion d’erreur incomplète
this.error = error.message  
→ Aucune balise n’affiche cette erreur dans `home.component.html`.

### Observables gérés manuellement
- subscribe direct
- pas de désabonnement  
  → Peu robuste.

### Logique Chart.js + navigation Angular mélangées
- Le clic dans le graphique redirige la route Angular.  
  → Mauvaise séparation des responsabilités.

### Destruction manquante du graphique
Aucun `ngOnDestroy()` → risque de fuites mémoire si le composant est recréé.

---

## 3. Analyse du CountryComponent

Fichier : `src/app/pages/country/country.component.ts`

### Duplication de l’appel HTTP
Même logique que dans `HomeComponent` → devrait passer par un service unique.

### Usage massif de any
selectedCountry = data.find((i: any) => ...)  
→ Doit être remplacé par des types stricts (`Olympic` et `Participation`).

### Gestion du paramètre de route peu lisible
route.paramMap.subscribe(...)  
→ `snapshot` serait plus clair :  
route.snapshot.paramMap.get('countryName')

### Erreur jamais affichée
this.error existe, mais n’apparaît pas dans `country.component.html`.

---

## 4. Synthèse des problèmes identifiés

- Appels HTTP directement dans les composants.
- Usage massif du type `any`.
- Absence totale d’interfaces TypeScript.
- Aucune couche service.
- Observables gérés manuellement.
- Logique Chart.js mélangée avec la logique Angular.
- Erreurs jamais affichées dans l’UI.
- Présence de `console.log`.
- HTML contenant du code inutile.
- Composants trop volumineux (pas de découpage).

---

## Conclusion

Le code actuel fonctionne mais présente plusieurs anti-patterns Angular :

- mauvaise séparation des responsabilités,
- typage faible,
- duplication de logique,
- gestion trop basique des observables,
- tests non pertinents,
- architecture difficile à faire évoluer vers une vraie API back-end.

---

# Étape 2 – Proposition de nouvelle architecture front-end

## 1. Principes d’architecture retenus

- **Séparer l’affichage de la logique métier**
  - Les composants gèrent uniquement l’UI, les interactions et le binding.
  - Les services gèrent les accès aux données, les calculs, les transformations.

- **Centraliser les accès aux données dans `services/`**
  - Tous les appels au JSON local puis à l’API REST passeront par `DataService`.
  - Pattern : **Singleton** (Angular fournit une seule instance via `providedIn: 'root'`).

- **Typage fort avec des modèles (`models/`)**
  - Création des interfaces :
    - `Olympic` (id, country, participations[])
    - `Participation` (id, year, city, medalsCount, athleteCount)

- **Organisation claire des dossiers**
  - `pages/` : composants attachés au routing (écrans)
  - `components/` : composants UI réutilisables (ex : graphiques, header…)
  - `services/` : logique métier et accès aux données
  - `models/` : interfaces TypeScript

---

## 2. Nouvelle arborescence proposée

Cible pour `src/app/` :

- `src/app/`
  - `pages/`
    - `home/`
      - home.component.ts / .html / .scss
    - `country/`
      - country.component.ts / .html / .scss
    - `not-found/`
      - not-found.component.ts / .html / .scss
  - `components/`
    - (pour futurs composants réutilisables : graphique, header, carte pays…)
  - `services/`
    - `data.service.ts`
  - `models/`
    - `olympic.model.ts` (interface `Olympic`)
    - `participation.model.ts` (interface `Participation`)
  - `app-routing.module.ts`
  - `app.component.ts / .html / .scss`

Cette structure :
- sépare clairement la présentation de la logique métier,
- prépare l’arrivée d’une API réelle,
- favorise la modularité.

---

## 3. Répartition des fichiers existants (déplacement “virtuel”)

### Pages (src/app/pages/)
- `HomeComponent` → reste dans `pages/home`
- `CountryComponent` → reste dans `pages/country`
- `NotFoundComponent` → reste dans `pages/not-found`

### Services (src/app/services/)
- Nouveau fichier : `data.service.ts`
  - Rôle :
    - charger les données depuis `assets/mock/olympic.json`,
    - fournir :
      - `getCountries(): Observable<Olympic[]>`
      - `getCountryByName(name: string): Observable<Olympic | undefined>`
  - Singleton (`providedIn: root`)

### Modèles (src/app/models/)
- `olympic.model.ts` → interface `Olympic`
- `participation.model.ts` → interface `Participation`

### Composants réutilisables (src/app/components/)
- Vider les gros composants à l’avenir :
  - `MedalChartComponent` (pie chart)
  - `CountryCardComponent` (KPI pays)
  - `HeaderComponent` (titre + stats réutilisable)

---

## 4. Design patterns utilisés et bénéfices attendus

### Pattern Singleton (services)
- Angular instancie `DataService` une seule fois.
- Centralise :
  - URL des données,
  - logique de transformation,
  - interaction future avec l’API.

### Séparation Component / Service
- Les pages ne gèrent plus :
  - appels HTTP,
  - agrégations de données,
  - parsing JSON.
- Avantages :
  - composants plus propres,
  - meilleure testabilité,
  - meilleure évolutivité.

### Modèles TypeScript
- Plus de `any`.
- Sécurité de typage.
- Meilleure lisibilité du code.
- Auto-complétion dans l’IDE.

---

## 5. Préparation à l’intégration d’un back-end

L’organisation proposée :
- permet de remplacer facilement les mocks JSON par de vraies requêtes HTTP,
- isole complètement la logique d’accès aux données dans `DataService`,
- garantit que les pages ne manipulent que des données typées,
- limite les modifications au seul dossier `services/` lors du passage à une API REST.

---

## 6. Synthèse de l’architecture cible

L’architecture finale recherchée :

- conserve `src/app/pages` pour les écrans,
- crée `services/`, `models/`, `components/`,
- applique :
  - pattern Singleton pour les services,
  - séparation nette component/service,
  - typage strict,
- prépare la transition naturelle vers une API back-end.

Cette architecture est simple, claire, évolutive et parfaitement adaptée pour la suite du projet TéléSport.

