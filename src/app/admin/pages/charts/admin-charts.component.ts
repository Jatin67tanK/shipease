import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-admin-charts',
  templateUrl: './admin-charts.component.html'
})
export class AdminChartsComponent implements OnInit, OnDestroy {

  @ViewChild('barChart',   { static: false }) barChartRef!:    ElementRef<HTMLCanvasElement>;
  @ViewChild('hbarChart',  { static: false }) hbarChartRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('doughChart', { static: false }) doughChartRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('grpChart',   { static: false }) grpChartRef!:    ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart',  { static: false }) lineChartRef!:   ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  // Controls
  barMonth  = new Date().getMonth() + 1;
  barYear   = new Date().getFullYear();
  barTotal  = 0;

  hbarFrom  = this.formatDate(new Date(new Date().setDate(1)));
  hbarTo    = this.formatDate(new Date());

  doughFrom = this.formatDate(new Date(new Date().setDate(1)));
  doughTo   = this.formatDate(new Date());

  grpMonth  = new Date().getMonth() + 1;
  grpYear   = new Date().getFullYear();

  activeTab = 'bookings';
  isLoading: Record<string, boolean> = {
    bookings: false, cities: false, status: false, employees: false, trend: false
  };

  years  = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  months = [
    { v: 1, l: 'January' }, { v: 2, l: 'February' }, { v: 3, l: 'March' },
    { v: 4, l: 'April'   }, { v: 5, l: 'May'      }, { v: 6, l: 'June'  },
    { v: 7, l: 'July'    }, { v: 8, l: 'August'   }, { v: 9, l: 'September' },
    { v: 10, l: 'October' }, { v: 11, l: 'November' }, { v: 12, l: 'December' }
  ];

  statusColors = ['#9CA3AF','#3B82F6','#F59E0B','#22C55E','#EF4444'];

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.loadTab('bookings'); }

  ngOnDestroy(): void { this.charts.forEach(c => c.destroy()); }

  // ── Tab switching ────────────────────────────────────────
  setTab(tab: string): void {
    this.activeTab = tab;
    setTimeout(() => this.loadTab(tab), 50);
  }

  loadTab(tab: string): void {
    this.destroyAll();
    switch (tab) {
      case 'bookings':  this.loadBarChart();    break;
      case 'cities':    this.loadHBarChart();   break;
      case 'status':    this.loadDoughnut();    break;
      case 'employees': this.loadGroupedBar();  break;
      case 'trend':     this.loadLineChart();   break;
    }
  }

  private destroyAll(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  // ── Chart 1: Monthly Bookings (Bar) ─────────────────────
  loadBarChart(): void {
    this.isLoading['bookings'] = true;
    this.http.get<any>(
      `${this.API}/api/admin/stats/monthly-bookings?month=${this.barMonth}&year=${this.barYear}`
    ).subscribe({
      next: (r) => {
        this.barTotal = r.data.total;
        setTimeout(() => {
          const ctx = this.barChartRef?.nativeElement?.getContext('2d');
          if (!ctx) return;
          const chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: r.data.days.map((d: number) => `Day ${d}`),
              datasets: [{
                label: 'Parcels Booked',
                data: r.data.counts,
                backgroundColor: '#3B82F6',
                hoverBackgroundColor: '#1D4ED8',
                borderRadius: 6,
                borderSkipped: false,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8 }
              },
              scales: {
                x: { grid: { display: false }, ticks: { maxTicksLimit: 10, color: '#94a3b8' } },
                y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } }
              }
            }
          });
          this.charts.push(chart);
          this.isLoading['bookings'] = false;
        }, 50);
      },
      error: () => { this.isLoading['bookings'] = false; }
    });
  }

  // ── Chart 2: City Distribution (Horizontal Bar) ──────────
  loadHBarChart(): void {
    this.isLoading['cities'] = true;
    this.http.get<any>(
      `${this.API}/api/admin/stats/city-distribution?from=${this.hbarFrom}&to=${this.hbarTo}`
    ).subscribe({
      next: (r) => {
        setTimeout(() => {
          const ctx = this.hbarChartRef?.nativeElement?.getContext('2d');
          if (!ctx) return;
          const count = r.data.counts.length;
          const colors = r.data.cities.map((_: any, i: number) => {
            const t = count > 1 ? i / (count - 1) : 0;
            const r2 = Math.round(147 + t * (29  - 147));
            const g  = Math.round(197 + t * (78  - 197));
            const b  = Math.round(253 + t * (216 - 253));
            return `rgb(${r2},${g},${b})`;
          });
          const chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: r.data.cities,
              datasets: [{
                label: 'Parcels',
                data: r.data.counts,
                backgroundColor: colors,
                borderRadius: 4,
                borderSkipped: false,
              }]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8 }
              },
              scales: {
                x: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } },
                y: { grid: { display: false }, ticks: { color: '#374151', font: { weight: 600 } } }
              }
            }
          });
          this.charts.push(chart);
          this.isLoading['cities'] = false;
        }, 50);
      },
      error: () => { this.isLoading['cities'] = false; }
    });
  }

  // ── Chart 3: Status Doughnut ──────────────────────────────
  loadDoughnut(): void {
    this.isLoading['status'] = true;
    this.http.get<any>(
      `${this.API}/api/admin/stats/status-breakdown?from=${this.doughFrom}&to=${this.doughTo}`
    ).subscribe({
      next: (r) => {
        setTimeout(() => {
          const ctx = this.doughChartRef?.nativeElement?.getContext('2d');
          if (!ctx) return;
          const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: r.data.labels,
              datasets: [{
                data: r.data.counts,
                backgroundColor: this.statusColors,
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverOffset: 8,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { padding: 16, usePointStyle: true, color: '#374151' }
                },
                tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8 }
              }
            }
          });
          this.charts.push(chart);
          this.isLoading['status'] = false;
        }, 50);
      },
      error: () => { this.isLoading['status'] = false; }
    });
  }

  // ── Chart 4: Employee Performance (Grouped Bar) ───────────
  loadGroupedBar(): void {
    this.isLoading['employees'] = true;
    this.http.get<any>(
      `${this.API}/api/admin/stats/employee-performance?month=${this.grpMonth}&year=${this.grpYear}`
    ).subscribe({
      next: (r) => {
        setTimeout(() => {
          const ctx = this.grpChartRef?.nativeElement?.getContext('2d');
          if (!ctx) return;
          const chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: r.data.employees,
              datasets: [
                { label: 'Delivered',  data: r.data.delivered,  backgroundColor: '#22C55E', borderRadius: 4 },
                { label: 'In Transit', data: r.data.inTransit,  backgroundColor: '#F59E0B', borderRadius: 4 },
                { label: 'Failed',     data: r.data.failed,     backgroundColor: '#EF4444', borderRadius: 4 },
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top', labels: { padding: 16, usePointStyle: true } },
                tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8, mode: 'index' }
              },
              scales: {
                x: { grid: { display: false }, ticks: { color: '#374151' } },
                y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' } }
              }
            }
          });
          this.charts.push(chart);
          this.isLoading['employees'] = false;
        }, 50);
      },
      error: () => { this.isLoading['employees'] = false; }
    });
  }

  // ── Chart 5: Success Rate Trend (Line) ────────────────────
  loadLineChart(): void {
    this.isLoading['trend'] = true;
    this.http.get<any>(`${this.API}/api/admin/stats/success-rate-trend`).subscribe({
      next: (r) => {
        setTimeout(() => {
          const ctx = this.lineChartRef?.nativeElement?.getContext('2d');
          if (!ctx) return;
          const chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: r.data.dates,
              datasets: [
                {
                  label: 'Success Rate %',
                  data: r.data.rates,
                  borderColor: '#8B5CF6',
                  backgroundColor: 'rgba(139,92,246,0.08)',
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  pointHoverRadius: 7,
                  pointBackgroundColor: '#8B5CF6',
                },
                {
                  label: '80% Target',
                  data: r.data.dates.map(() => 80),
                  borderColor: '#EF4444',
                  borderDash: [6, 4],
                  pointRadius: 0,
                  borderWidth: 2,
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top', labels: { padding: 16, usePointStyle: true } },
                tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 8, mode: 'index' }
              },
              scales: {
                x: { grid: { display: false }, ticks: { maxTicksLimit: 10, color: '#94a3b8' } },
                y: { min: 0, max: 100, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', callback: (v) => v + '%' } }
              }
            }
          });
          this.charts.push(chart);
          this.isLoading['trend'] = false;
        }, 50);
      },
      error: () => { this.isLoading['trend'] = false; }
    });
  }

  // ── Reload handlers ──────────────────────────────────────
  reloadBar():   void { this.destroyAll(); this.loadBarChart();   }
  reloadHBar():  void { this.destroyAll(); this.loadHBarChart();  }
  reloadDough(): void { this.destroyAll(); this.loadDoughnut();   }
  reloadGrp():   void { this.destroyAll(); this.loadGroupedBar(); }

  private formatDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }
}
