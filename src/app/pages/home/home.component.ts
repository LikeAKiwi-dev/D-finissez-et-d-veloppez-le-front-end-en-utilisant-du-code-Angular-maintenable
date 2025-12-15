import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { Olympic } from '../../models/olympic.model';
import { Participation } from '../../models/participation.model';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  public totalCountries = 0;
  public totalJOs = 0;
  public error = '';
  public titlePage: string = 'Médailles par pays';
  public olympics: Olympic[] = [];

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.getOlympics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: Olympic[]) => {
          this.olympics = data;

          if (data && data.length > 0) {
            this.totalJOs = Array.from(
              new Set(
                data.flatMap((o: Olympic) =>
                  o.participations.map((p: Participation) => p.year)
                )
              )
            ).length;

            const countries: string[] = data.map((o: Olympic) => o.country);
            this.totalCountries = countries.length;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
        }
      });
  }
}
