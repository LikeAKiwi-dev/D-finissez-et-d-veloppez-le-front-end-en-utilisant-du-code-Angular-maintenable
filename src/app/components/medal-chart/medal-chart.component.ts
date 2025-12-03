import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Olympic } from '../../models/olympic.model';
import { Participation } from '../../models/participation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medal-chart',
  templateUrl: './medal-chart.component.html',
  styleUrls: ['./medal-chart.component.scss']
})
export class MedalChartComponent implements OnChanges, OnDestroy {

  @Input() olympics: Olympic[] = [];

  private chart?: Chart;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['olympics'] && this.olympics && this.olympics.length > 0) {
      this.buildChart();
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

  private buildChart(): void {
    // On détruit l'ancien graphique si besoin
    this.destroyChart();

    const labels = this.olympics.map(o => o.country);
    const data = this.olympics.map(o =>
      o.participations.reduce(
        (sum: number, p: Participation) => sum + p.medalsCount,
        0
      )
    );

    const canvas = document.getElementById('DashboardPieChart') as HTMLCanvasElement | null;
    if (!canvas) {
      console.error('Canvas DashboardPieChart introuvable');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Medals',
          data: data,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        responsive: true,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const countryId = this.olympics[index].id;
            this.router.navigate(['country', countryId]);
          }
        }
      }
    });
  }
}
