import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cycle-history',
  templateUrl: './cycle-history.component.html'
})
export class CycleHistoryComponent implements OnInit {

  cycles:     any[]   = [];
  total:      number  = 0;
  page:       number  = 1;
  pages:      number  = 1;
  isLoading   = true;
  isRunning   = false;

  expandedId: string | null = null;
  cycleDetail: any = null;
  detailLoading = false;

  successMsg = '';
  errorMsg   = '';

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.loadCycles(); }

  loadCycles(): void {
    this.isLoading = true;
    this.http.get<any>(`${this.API}/api/admin/cycles?page=${this.page}&limit=10`).subscribe({
      next: (r) => {
        this.cycles    = r.data.cycles;
        this.total     = r.data.total;
        this.pages     = r.data.pages;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  // ── Expand Row ────────────────────────────────────────────
  toggleExpand(cycle: any): void {
    if (this.expandedId === cycle._id) {
      this.expandedId  = null;
      this.cycleDetail = null;
      return;
    }
    this.expandedId    = cycle._id;
    this.cycleDetail   = null;
    this.detailLoading = true;

    this.http.get<any>(`${this.API}/api/admin/cycles/${cycle._id}`).subscribe({
      next: (r) => { this.cycleDetail = r.data; this.detailLoading = false; },
      error: () => { this.detailLoading = false; }
    });
  }

  // ── Manual Cycle Run ─────────────────────────────────────
  runCycle(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.errorMsg  = '';
    this.successMsg = '';

    this.http.post<any>(`${this.API}/api/admin/run-cycle`, {}).subscribe({
      next: (r) => {
        this.successMsg = `Cycle #${r.data?.cycleNumber} completed — ${r.data?.totalAssigned} parcels assigned`;
        this.isRunning  = false;
        this.loadCycles();
        setTimeout(() => this.successMsg = '', 5000);
      },
      error: (err) => {
        this.errorMsg  = err?.error?.error || 'Cycle failed';
        this.isRunning = false;
        setTimeout(() => this.errorMsg = '', 5000);
      }
    });
  }

  // ── Pagination ────────────────────────────────────────────
  prevPage(): void { if (this.page > 1) { this.page--; this.loadCycles(); } }
  nextPage(): void { if (this.page < this.pages) { this.page++; this.loadCycles(); } }

  // ── Helpers ───────────────────────────────────────────────
  statusClass(s: string): string {
    const m: Record<string, string> = {
      RUNNING:   'bg-yellow-100 text-yellow-600',
      COMPLETED: 'bg-green-100  text-green-600',
      FAILED:    'bg-red-100    text-red-600',
    };
    return m[s] || 'bg-gray-100 text-gray-600';
  }

  duration(c: any): string {
    if (!c.startedAt || !c.completedAt) return '—';
    const ms = new Date(c.completedAt).getTime() - new Date(c.startedAt).getTime();
    return ms < 60000 ? `${Math.round(ms / 1000)}s` : `${Math.round(ms / 60000)}m`;
  }
}
