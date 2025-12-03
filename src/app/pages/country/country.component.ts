import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Chart} from 'chart.js/auto';

import {DataService} from '../../services/data.service';
import {Olympic} from '../../models/olympic.model';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  country?: Olympic;
  error: string = '';

  private chart?: Chart;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    const countryName = this.route.snapshot.paramMap.get('countryName');
    if (!countryName) {
      this.error = 'Aucun pays spécifié.';
      return;
    }

    this.dataService.getCountryByName(countryName).subscribe({
      next: (country: Olympic | undefined) => {
        if (!country) {
          this.error = 'Pays introuvable.';
          return;
        }

        this.country = country;
        /* this.computeStats(country);
         this.buildCountryChart(country);*/
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des données :', err);
        this.error = 'Impossible de charger les données pour ce pays.';
      }
    });
  }
}
