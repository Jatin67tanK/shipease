import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-delivery-dashboard',
  templateUrl: './delivery-dashboard.component.html'
})
export class DeliveryDashboardComponent implements OnInit {

  profile:  any    = null;
  stats:    any    = { total: 0, assigned: 0, inTransit: 0, delivered: 0, failed: 0 };
  parcels:  any[]  = [];
  filtered: any[]  = [];
  isLoading        = true;
  isDownloading    = false;

  // Filters
  searchQuery   = '';
  statusFilter  = '';
  dateFilter    = '';

  // Status update modal
  showModal       = false;
  selectedParcel: any = null;
  newStatus       = '';
  isUpdating      = false;
  updateError     = '';

  readonly statusTabs = [
    { label: 'All',         value: '' },
    { label: 'Assigned',    value: 'ASSIGNED' },
    { label: 'In Transit',  value: 'IN_TRANSIT' },
    { label: 'Delivered',   value: 'DELIVERED' },
    { label: 'Failed',      value: 'FAILED' },
  ];

  readonly statCards = [
   { key: 'total',     label: 'Total',      icon: 'fa-box',          color: 'bg-slate-50  border-slate-200  text-slate-700'  },
{ key: 'assigned',  label: 'Assigned',   icon: 'fa-clipboard',    color: 'bg-blue-50   border-blue-200   text-blue-700'   },
{ key: 'inTransit', label: 'In Transit', icon: 'fa-truck',        color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
{ key: 'delivered', label: 'Delivered',  icon: 'fa-circle-check', color: 'bg-green-50  border-green-200  text-green-700'  },
{ key: 'failed',    label: 'Failed',     icon: 'fa-circle-xmark', color: 'bg-red-50    border-red-200    text-red-700'    },
  ];

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadStats();
    this.loadParcels();
  }

  loadProfile(): void {
    this.http.get<any>(`${this.API}/api/employee/me`).subscribe({
      next: (r) => { this.profile = r.data; }
    });
  }

  loadStats(): void {
    this.http.get<any>(`${this.API}/api/employee/stats`).subscribe({
      next: (r) => { this.stats = r.data; }
    });
  }

  loadParcels(): void {
    this.isLoading = true;
    this.http.get<any>(`${this.API}/api/employee/parcels`).subscribe({
      next: (r) => {
        this.parcels  = r.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilters(): void {
    let data = [...this.parcels];

    if (this.statusFilter) {
      data = data.filter(p => p.cycle_status === this.statusFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      data = data.filter(p =>
        p.tracking_id?.toLowerCase().includes(q) ||
        p.receiver_name?.toLowerCase().includes(q) ||
        p.receiver_city?.toLowerCase().includes(q)
      );
    }

    if (this.dateFilter) {
      const d = new Date(this.dateFilter).toDateString();
      data = data.filter(p => new Date(p.assignedAt).toDateString() === d);
    }

    this.filtered = data;
  }

  setTab(value: string): void { this.statusFilter = value; this.applyFilters(); }
  onSearch(v: string): void   { this.searchQuery  = v;     this.applyFilters(); }
  onDate(v: string): void     { this.dateFilter   = v;     this.applyFilters(); }

  // ── Status update modal ───────────────────────────
  openModal(parcel: any): void {
    this.selectedParcel = parcel;
    this.newStatus      = parcel.cycle_status === 'ASSIGNED' ? 'IN_TRANSIT' : 'DELIVERED';
    this.updateError    = '';
    this.showModal      = true;
  }

  closeModal(): void { this.showModal = false; this.selectedParcel = null; }

  confirmUpdate(): void {
    if (!this.selectedParcel || this.isUpdating) return;
    this.isUpdating = true;
    this.updateError = '';

    this.http.patch<any>(
      `${this.API}/api/employee/parcels/${this.selectedParcel._id}/status`,
      { status: this.newStatus }
    ).subscribe({
      next: () => {
        this.closeModal();
        this.loadParcels();
        this.loadStats();
        this.isUpdating = false;
      },
      error: (err) => {
        this.updateError = err?.error?.error || 'Update failed';
        this.isUpdating  = false;
      }
    });
  }

  markFailed(): void {
    if (!this.selectedParcel || this.isUpdating) return;
    this.isUpdating = true;

    this.http.patch<any>(
      `${this.API}/api/employee/parcels/${this.selectedParcel._id}/status`,
      { status: 'FAILED' }
    ).subscribe({
      next: () => { this.closeModal(); this.loadParcels(); this.loadStats(); this.isUpdating = false; },
      error: (err) => { this.updateError = err?.error?.error || 'Failed'; this.isUpdating = false; }
    });
  }

  // ── PDF Download ──────────────────────────────────
  downloadPDF(): void {
    this.isDownloading = true;
    this.http.get(`${this.API}/api/employee/parcels/download-pdf`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href = url; a.download = `my-parcels.pdf`; a.click();
        window.URL.revokeObjectURL(url);
        this.isDownloading = false;
      },
      error: () => { alert('PDF download failed'); this.isDownloading = false; }
    });
  }

  // ── Helpers ──────────────────────────────────────
  getStatusClass(s: string): string {
    const m: Record<string, string> = {
      'PENDING':    'bg-gray-100   text-gray-600',
      'ASSIGNED':   'bg-blue-100   text-blue-600',
      'IN_TRANSIT': 'bg-yellow-100 text-yellow-600',
      'DELIVERED':  'bg-green-100  text-green-600',
      'FAILED':     'bg-red-100    text-red-600',
    };
    return m[s] || 'bg-gray-100 text-gray-600';
  }

  canUpdate(parcel: any): boolean {
    return ['ASSIGNED', 'IN_TRANSIT'].includes(parcel.cycle_status);
  }

  getNextLabel(parcel: any): string {
    return parcel.cycle_status === 'ASSIGNED' ? 'Mark In Transit' : 'Mark Delivered';
  }
}
