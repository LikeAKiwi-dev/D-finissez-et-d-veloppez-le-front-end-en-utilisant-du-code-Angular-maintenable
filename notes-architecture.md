# Étape 1 – Analyse du code existant

## 1. Structure générale du projet

- Les composants sont rangés dans `src/app/pages`.
- Aucun dossier `services`, `core` ou `shared`.  
  Toute la logique métier, la récupération des données et les calculs sont dans les composants.

**Exemple (src/app/pages/home/home.component.ts)**  
private olympicUrl = './assets/mock/olympic.json';  
ngOnInit() {  
this.http.get<any[]>(this.olympicUrl).subscribe(data => { ... });  
}

**Risques :**
- duplication de code
- faible testabilité
- difficile à remplacer par une API réelle

**Amélioration :** créer un `OlympicService`.

Les composants ont trop de responsabilités :
- `home.component.ts` : HTTP, calculs, graphiques, navigation.
- `country.component.ts` : HTTP, filtrage, calculs, graphiques.

---

## 2. Analyse du HomeComponent
Fichier : `src/app/pages/home/home.component.ts`

### Appels HTTP
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
- `OlympicCountry` : id, country, participations[]

### Console.log inutiles
console.log(JSON.stringify(data))  
→ À retirer

### Gestion d’erreur incomplète
this.error = error.message  
→ Aucune balise affichant cette erreur dans `home.component.html`.

### Observables gérés manuellement
- subscribe direct
- pas de désabonnement  
  → Peu robuste.

### Logique Chart.js + navigation Angular mélangées
- Le clic sur un segment du graphique redirige via `router.navigate`.  
  → Mauvaise séparation des responsabilités.

### Destruction manquante du graphique
Aucun `ngOnDestroy()` pour détruire le graphique → risque de fuites mémoire.

---

## 3. Analyse du CountryComponent
Fichier : `src/app/pages/country/country.component.ts`

### Duplication de l’appel HTTP
Même logique de chargement que dans Home → devrait être centralisé dans un service.

### Usage massif de any
selectedCountry = data.find((i: any) => ...)  
→ Doit être remplacé par des types stricts.

### Gestion du paramètre de route peu lisible
route.paramMap.subscribe(...)  
→ `snapshot` serait plus simple :  
route.snapshot.paramMap.get('countryName')


### Erreur jamais affichée
this.error existe mais n’apparaît pas dans le template HTML.

---

## 6. Synthèse des problèmes identifiés

- Appels HTTP directement dans les composants.
- Usage massif du type `any`.
- Absence d’interfaces TypeScript.
- Aucune couche service.
- Observables gérés manuellement.
- Logique Chart.js mélangée avec la logique Angular.
- Erreurs jamais affichées dans la vue.
- Présence de console.log.
- HTML avec du code inutile.

---

## Conclusion

Le code actuel fonctionne mais présente plusieurs anti-patterns Angular :

- mauvaise séparation des responsabilités,
- typage faible,
- duplication de logique,
- gestion insuffisante des observables,
- tests non pertinents.

