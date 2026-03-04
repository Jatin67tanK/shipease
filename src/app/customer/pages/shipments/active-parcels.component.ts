import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-active-parcels',
  templateUrl: './active-parcels.component.html'
})
export class ActiveParcelsComponent implements OnInit {

  parcels: any[] = [];
  filteredParcels: any[] = [];
  isLoading = true;
  searchQuery = '';

  // ✅ FILTER
  selectedMonth: string = '';   // '01' to '12' or ''
  selectedYear: string  = '';   // '2024', '2025' etc or ''
// ✅ STATUS FILTER
selectedStatus: string = '';

statusList: string[] = [
  'Booked',
  'Picked Up',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Refunded'
];
  monthList = [
    { value: '01', label: 'January'   },
    { value: '02', label: 'February'  },
    { value: '03', label: 'March'     },
    { value: '04', label: 'April'     },
    { value: '05', label: 'May'       },
    { value: '06', label: 'June'      },
    { value: '07', label: 'July'      },
    { value: '08', label: 'August'    },
    { value: '09', label: 'September' },
    { value: '10', label: 'October'   },
    { value: '11', label: 'November'  },
    { value: '12', label: 'December'  },
  ];

  yearList: string[] = [];

  // Image modal
  imageModal = false;
  imageModalParcel: any = null;
  fullImageUrl: string | null = null;

  constructor(private parcelService: ParcelService) {}

  ngOnInit() {
    this.buildYearList();
    this.loadParcels();
  }

  // ✅ Build year list dynamically (5 years back from current year)
  buildYearList(): void {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 4; y--) {
      this.yearList.push(String(y));
    }
  }

  loadParcels() {
    this.parcelService.getParcels('active').subscribe({
      next: (res: any) => {
        this.parcels = (res.data || []).map((p: any) => ({
          id:             p.tracking_id,
          sender_name:    p.sender_name,
          sender_phone:   p.sender_phone,
          sender_city:    p.sender_city,
          sender_state:   p.sender_state,
          pickup_address: p.pickup_address,
          receiver_name:  p.receiver_name,
          receiver_phone: p.receiver_phone,
          receiver_city:  p.receiver_city,
          receiver_state: p.receiver_state,
          drop_address:   p.drop_address,
          type:           p.parcel_type,
          weight:         p.parcel_weight,
          distance:       p.distance_category,
          delivery_type:  p.delivery_type,
          total_cost:     p.total_cost,
          payment_status: p.payment_status,
          status:         p.current_status,
          images:         p.parcel_images || [],
          createdAt:      p.createdAt
        }));
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.parcels = [];
        this.filteredParcels = [];
        this.isLoading = false;
      }
    });
  }

  // ✅ MASTER FILTER — applies search + month + year together
 applyFilters(): void {
  let result = [...this.parcels];

  // Month filter
  if (this.selectedMonth) {
    result = result.filter(p => {
      const d = new Date(p.createdAt);
      return String(d.getMonth() + 1).padStart(2, '0') === this.selectedMonth;
    });
  }

  // Year filter
  if (this.selectedYear) {
    result = result.filter(p => {
      const d = new Date(p.createdAt);
      return String(d.getFullYear()) === this.selectedYear;
    });
  }

  // ✅ Status filter
  if (this.selectedStatus) {
    result = result.filter(p => p.status === this.selectedStatus);
  }

  // Search filter
  const q = this.searchQuery.trim().toLowerCase();
  if (q) {
    result = result.filter(p =>
      p.id?.toLowerCase().includes(q)             ||
      p.sender_name?.toLowerCase().includes(q)    ||
      p.sender_phone?.toLowerCase().includes(q)   ||
      p.sender_city?.toLowerCase().includes(q)    ||
      p.sender_state?.toLowerCase().includes(q)   ||
      p.receiver_name?.toLowerCase().includes(q)  ||
      p.receiver_phone?.toLowerCase().includes(q) ||
      p.receiver_city?.toLowerCase().includes(q)  ||
      p.receiver_state?.toLowerCase().includes(q) ||
      p.type?.toLowerCase().includes(q)           ||
      p.distance?.toLowerCase().includes(q)       ||
      p.delivery_type?.toLowerCase().includes(q)  ||
      p.payment_status?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q)
    );
  }

  this.filteredParcels = result;
}

onStatusChange(status: string): void {
  this.selectedStatus = status;
  this.applyFilters();
}

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onMonthChange(month: string): void {
    this.selectedMonth = month;
    this.applyFilters();
  }

  onYearChange(year: string): void {
    this.selectedYear = year;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

clearFilters(): void {
  this.selectedMonth  = '';
  this.selectedYear   = '';
  this.selectedStatus = '';
  this.searchQuery    = '';
  this.applyFilters();
}

get hasActiveFilters(): boolean {
  return !!(
    this.selectedMonth ||
    this.selectedYear ||
    this.selectedStatus ||
    this.searchQuery
  );
}
  // ✅ IMAGE MODAL
  openImageModal(parcel: any): void {
    this.imageModalParcel = parcel;
    this.imageModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeImageModal(): void {
    this.imageModal = false;
    this.imageModalParcel = null;
    this.fullImageUrl = null;
    document.body.style.overflow = '';
  }

  openFullImage(filename: string): void {
    this.fullImageUrl = this.getImageUrl(filename);
  }

  closeFullImage(): void {
    this.fullImageUrl = null;
  }

  getImageUrl(filename: string): string {
    return `${environment.apiUrl.replace('/api', '')}/uploads/parcels/${filename}`;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/no-image.png';
  }
}