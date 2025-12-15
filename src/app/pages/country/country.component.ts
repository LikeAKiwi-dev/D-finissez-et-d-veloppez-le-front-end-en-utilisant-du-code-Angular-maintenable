import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Chart} from 'chart.js/auto';
import {DataService} from '../../services/data.service';
import {Olympic} from '../../models/olympic.model';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  country?: Olympic;
  error: string = '';
  private readonly destroyRef = inject(DestroyRef);
  private chart?: Chart;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    const countryId = parseInt(<string>this.route.snapshot.paramMap.get('id'));
    if (!countryId) {
      this.error = 'Aucun pays spécifié.';
      return;
    }

    this.dataService.getCountryById(countryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (country: Olympic | undefined) => {
        if (!country) {
          this.error = 'Pays introuvable.';
          return;
        }

        this.country = country;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des données :', err);
        this.error = 'Impossible de charger les données pour ce pays.';
      }
    });
  }
}
