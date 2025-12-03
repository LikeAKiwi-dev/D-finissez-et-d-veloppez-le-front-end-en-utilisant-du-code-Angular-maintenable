import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Olympic } from '../../models/olympic.model';
import { Participation } from '../../models/participation.model';

@Component({
  selector: 'app-country-card',
  templateUrl: './country-card.component.html',
  styleUrls: ['./country-card.component.scss']
})
export class CountryCardComponent implements OnChanges, OnDestroy {

  @Input() country?: Olympic;

  totalMedals: number = 0;
  totalAthletes: number = 0;
  totalEntries: number = 0;

  private chart?: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['country'] && this.country) {
      this.computeStats(this.country);
      this.buildCountryChart(this.country);
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

  private computeStats(country: Olympic): void {
    this.totalEntries = country.participations.length;

    this.totalMedals = country.participations
      .reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);

    this.totalAthletes = country.participations
      .reduce((sum: number, p: Participation) => sum + p.athleteCount, 0);
  }

  private buildCountryChart(country: Olympic): void {
    this.destroyChart();

    const years: number[] = country.participations.map(
      (p: Participation) => p.year
    );
    const medalsByYear: number[] = country.participations.map(
      (p: Participation) => p.medalsCount
    );

    const canvas = document.getElementById('countryChart') as HTMLCanvasElement | null;
    if (!canvas) {
      console.error('Canvas countryChart introuvable');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Médailles par année',
            data: medalsByYear,
            fill: false,
            tension: 0.25
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }
}
