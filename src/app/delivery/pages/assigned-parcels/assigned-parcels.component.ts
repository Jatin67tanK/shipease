import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assigned-parcels',
  templateUrl: './assigned-parcels.component.html'
})
export class AssignedParcelsComponent implements OnInit {

  parcels: any[] = [];
  filteredParcels: any[] = [];
  isLoading = true;

  // Filters
  selectedStatus = '';
  searchQuery = '';

  // Status modal
  showModal = false;
  selectedParcel: any = null;
  newStatus = '';
  deliveryNote = '';
  previousStatus = '';
  isUpdating = false;

  // Image modal
  imageModal = false;
  imageModalParcel: any = null;
  fullImageUrl: string | null = null;

  readonly allowedStatuses = ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

  readonly statusFlow: Record<string, string[]> = {
    'Booked':           ['Picked Up'],
    'Picked Up':        ['In Transit'],
    'In Transit':       ['Out for Delivery'],
    'Out for Delivery': ['Delivered'],
    'Delivered':        [],
  };

  readonly filterTabs = [
    { label: 'All',              value: '' },
    { label: 'Picked Up',        value: 'Picked Up' },
    { label: 'In Transit',       value: 'In Transit' },
    { label: 'Out for Delivery', value: 'Out for Delivery' },
    { label: 'Delivered',        value: 'Delivered' },
  ];

  constructor(private parcelService: ParcelService) {}

  ngOnInit(): void { this.loadParcels(); }

  loadParcels(): void {
    this.isLoading = true;
    this.parcelService.getAssignedParcels().subscribe({
      next: (res: any) => {
        this.parcels = res.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilters(): void {
    let data = [...this.parcels];

    if (this.selectedStatus) {
      data = data.filter(p => p.current_status === this.selectedStatus);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      data = data.filter(p =>
        p.tracking_id?.toLowerCase().includes(q) ||
        p.receiver_name?.toLowerCase().includes(q) ||
        p.drop_address?.toLowerCase().includes(q) ||
        p.receiver_city?.toLowerCase().includes(q)
      );
    }

    this.filteredParcels = data;
  }

  setTab(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSearch(val: string): void {
    this.searchQuery = val;
    this.applyFilters();
  }

  // ── Next status available for a parcel ──────────────
  getNextStatuses(parcel: any): string[] {
    return this.statusFlow[parcel.current_status] || [];
  }

  canUpdate(parcel: any): boolean {
    return this.getNextStatuses(parcel).length > 0;
  }

  // ── Open status modal ────────────────────────────────
  openStatusModal(parcel: any): void {
    this.selectedParcel = parcel;
    this.previousStatus = parcel.current_status;
    const nextStatuses = this.getNextStatuses(parcel);
    this.newStatus = nextStatuses[0] || '';
    this.deliveryNote = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedParcel = null;
    this.isUpdating = false;
  }

  confirmStatusUpdate(): void {
    if (!this.selectedParcel || !this.newStatus || this.isUpdating) return;
    this.isUpdating = true;

    this.parcelService.updateDeliveryStatus(
      this.selectedParcel.tracking_id,
      this.newStatus,
      this.deliveryNote
    ).subscribe({
      next: () => {
        this.selectedParcel.current_status = this.newStatus;
        this.applyFilters();
        this.closeModal();
      },
      error: (err) => {
        alert(err?.error?.message || 'Update failed. Please try again.');
        this.isUpdating = false;
      }
    });
  }

  // ── Image helpers ────────────────────────────────────
  openImageModal(p: any): void { this.imageModalParcel = p; this.imageModal = true; }
  closeImageModal(): void { this.imageModal = false; this.fullImageUrl = null; }
  openFullImage(f: string): void { this.fullImageUrl = this.getImageUrl(f); }
  closeFullImage(): void { this.fullImageUrl = null; }

  getImageUrl(f: string): string {
    return `${environment.apiUrl}/uploads/parcels/${f}`;
  }

  // ── Status badge class ───────────────────────────────
  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Booked': 'bg-slate-100 text-slate-700',
      'Picked Up': 'bg-blue-100 text-blue-700',
      'In Transit': 'bg-yellow-100 text-yellow-700',
      'Out for Delivery': 'bg-orange-100 text-orange-700',
      'Delivered': 'bg-green-100 text-green-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
}
