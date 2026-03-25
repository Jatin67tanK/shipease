import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-progress',
  templateUrl: './employee-progress.component.html'
})
export class EmployeeProgressComponent implements OnInit {

  employees:  any[] = [];
  allEmployees: any[] = [];
  isLoading   = true;

  // View Parcels Modal
  showParcelsModal = false;
  selectedEmployee: any = null;
  employeeParcels: any[] = [];
  parcelsLoading  = false;

  // Reassign Modal
  showReassignModal  = false;
  selectedParcelIds: string[] = [];
  toEmployeeId       = '';
  isReassigning      = false;
  reassignMessage    = '';

  // Alerts
  successMsg = '';
  errorMsg   = '';

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    this.isLoading = true;
    this.http.get<any>(`${this.API}/api/admin/employees/progress`).subscribe({
      next: (r) => {
        this.employees    = r.data;
        this.allEmployees = r.data;
        this.isLoading    = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  // ── Success % color ───────────────────────────────────────
  rateColor(rate: number): string {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  // ── Toggle Availability ───────────────────────────────────
 toggleAvailability(emp: any): void {
  const headers = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  this.http.patch<any>(`${this.API}/api/admin/employees/${emp._id}/toggle-availability`, {}, headers).subscribe({
    next: (r) => {
      emp.isAvailable = r.data.isAvailable;
      this.successMsg = r.message;
      setTimeout(() => this.successMsg = '', 3000);
    },
    error: (err) => {
      this.errorMsg = err?.error?.error || 'Toggle failed';
      setTimeout(() => this.errorMsg = '', 3000);
    }
  });
}

  // ── View Parcels Modal ────────────────────────────────────
  openParcelsModal(emp: any): void {
    this.selectedEmployee = emp;
    this.showParcelsModal = true;
    this.parcelsLoading   = true;
    this.selectedParcelIds = [];

    this.http.get<any>(`${this.API}/api/admin/employees/${emp._id}/parcels`).subscribe({
      next: (r) => { this.employeeParcels = r.data; this.parcelsLoading = false; },
      error: () => { this.parcelsLoading = false; }
    });
  }

  closeParcelsModal(): void { this.showParcelsModal = false; this.employeeParcels = []; }

  // ── Parcel selection for reassign ────────────────────────
  toggleParcel(id: string): void {
    const idx = this.selectedParcelIds.indexOf(id);
    if (idx >= 0) this.selectedParcelIds.splice(idx, 1);
    else          this.selectedParcelIds.push(id);
  }

  isSelected(id: string): boolean { return this.selectedParcelIds.includes(id); }

  // ── Open Reassign Modal ───────────────────────────────────
  openReassignModal(): void {
    if (this.selectedParcelIds.length === 0) return;
    this.showReassignModal = true;
    this.toEmployeeId      = '';
    this.reassignMessage   = '';
  }

  closeReassignModal(): void { this.showReassignModal = false; }

  // ── Confirm Reassign ──────────────────────────────────────
  confirmReassign(): void {
    if (!this.toEmployeeId) { this.reassignMessage = 'Select an employee'; return; }
    this.isReassigning = true;

    this.http.post<any>(`${this.API}/api/admin/parcels/reassign`, {
      parcelIds:    this.selectedParcelIds,
      toEmployeeId: this.toEmployeeId
    }).subscribe({
      next: (r) => {
        this.successMsg        = r.message;
        this.isReassigning     = false;
        this.showReassignModal = false;
        this.showParcelsModal  = false;
        this.selectedParcelIds = [];
        this.loadProgress();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.reassignMessage = err?.error?.error || 'Reassign failed';
        this.isReassigning   = false;
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  statusBadge(s: string): string {
    const m: Record<string, string> = {
      'PENDING':    'bg-gray-100 text-gray-600',
      'ASSIGNED':   'bg-blue-100 text-blue-600',
      'IN_TRANSIT': 'bg-yellow-100 text-yellow-600',
      'DELIVERED':  'bg-green-100 text-green-600',
      'FAILED':     'bg-red-100 text-red-600',
    };
    return m[s] || 'bg-gray-100 text-gray-600';
  }

  otherEmployees(): any[] {
    return this.allEmployees.filter(e => e._id !== this.selectedEmployee?._id);
  }
}
