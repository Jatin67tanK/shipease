import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';
@Component({
  selector: 'app-assigned-parcels',
  templateUrl: './assigned-parcels.component.html',
   // optional, if you have CSS
})
export class AssignedParcelsComponent implements OnInit {
  parcels: any[] = [];
  filteredParcels: any[] = [];       // renamed
  isLoading = true;

  filterTabs = [
    { label: 'All', value: '' },
    { label: 'Assigned', value: 'ASSIGNED' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Failed', value: 'FAILED' },
  ];
  selectedStatus = '';                // renamed
  searchQuery = '';

  // MODALS
  showModal = false;
  selectedParcel: any = null;
  newStatus = '';
  previousStatus = '';
  deliveryNote = '';
  isUpdating = false;
  updateError = '';

  imageModal: boolean = false;
  imageModalParcel: any = null;
  fullImageUrl: string | null = null;

  constructor(private parcelService: ParcelService) {}

  ngOnInit(): void { this.loadParcels(); }

  loadParcels(): void {
    this.isLoading = true;
    this.parcelService.getAssignedParcels().subscribe({
      next: (r) => {
        this.parcels = r.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilters(): void {
    let data = [...this.parcels];
    if (this.selectedStatus) data = data.filter(p => p.cycle_status === this.selectedStatus);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      data = data.filter(p =>
        p.tracking_id?.toLowerCase().includes(q) ||
        p.receiver_name?.toLowerCase().includes(q)
      );
    }
    this.filteredParcels = data;
  }

  setTab(v: string): void { this.selectedStatus = v; this.applyFilters(); }
  onSearch(v: string): void { this.searchQuery = v; this.applyFilters(); }

  openImageModal(parcel: any): void { this.imageModal = true; this.imageModalParcel = parcel; }
  closeImageModal(): void { this.imageModal = false; this.imageModalParcel = null; }

  openFullImage(img: string): void { this.fullImageUrl = img; }
  closeFullImage(): void { this.fullImageUrl = null; }

  getImageUrl(img: string): string { return img; }  // adjust if you have base URL

  confirmStatusUpdate(): void {
    if (!this.selectedParcel || this.isUpdating) return;
    this.isUpdating = true;
    this.parcelService.updateDeliveryStatus(this.selectedParcel._id, this.newStatus)
      .subscribe({
        next: () => { this.loadParcels(); this.closeModal(); this.isUpdating = false; },
        error: (err: any) => { this.updateError = err?.error?.error || 'Update failed'; this.isUpdating = false; }
      });
  }

  openModal(parcel: any): void {
    this.selectedParcel = parcel;
    this.newStatus = parcel.cycle_status === 'ASSIGNED' ? 'IN_TRANSIT' : 'DELIVERED';
    this.previousStatus = parcel.cycle_status;
    this.deliveryNote = '';
    this.updateError = '';
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; this.selectedParcel = null; }
openStatusModal(parcel: any): void {
  this.openModal(parcel); // reuse existing method
}
  statusClass(s: string): string {
    const m: Record<string,string> = {
      'PENDING':    'bg-gray-100   text-gray-600',
      'ASSIGNED':   'bg-blue-100   text-blue-600',
      'IN_TRANSIT': 'bg-yellow-100 text-yellow-600',
      'DELIVERED':  'bg-green-100  text-green-600',
      'FAILED':     'bg-red-100    text-red-600',
    };
    return m[s] || 'bg-gray-100 text-gray-600';
  }

  canUpdate(p: any): boolean { return ['ASSIGNED','IN_TRANSIT'].includes(p.cycle_status); }
}