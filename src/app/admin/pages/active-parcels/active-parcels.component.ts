import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-active-parcels',
  templateUrl: './active-parcels.component.html'
})
export class ActiveParcelsComponent implements OnInit {
currentRouteStatus: string = 'active';
  parcels: any[] = [];
  filteredParcels: any[] = [];
  isLoading = true;

  // 🔍 Search
  searchQuery = '';
  searchResult: any = null;

  // 🎯 Multi-select Filters
  selectedMonths:   string[] = [];
  selectedYears:    string[] = [];
  selectedStatuses: string[] = [];
  selectedPayments: string[] = [];
  selectedStates:   string[] = [];
  selectedCities:   string[] = [];
  availableCities:  string[] = [];

  // 📂 Dropdown open state
  openDropdown: string | null = null;

  // 💳 Payment options
  paymentList = ['Paid', 'Pending', 'Failed'];

  // 📍 Location Filters
  stateList: string[] = [];

  stateCityMap: Record<string, string[]> = {
    'Maharashtra':    ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Gujarat':        ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Karnataka':      ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi'],
    'Tamil Nadu':     ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
    'Delhi':          ['New Delhi', 'Dwarka', 'Rohini', 'Janakpuri', 'Saket'],
    'Rajasthan':      ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Uttar Pradesh':  ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida'],
    'West Bengal':    ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur'],
    'Telangana':      ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    'Kerala':         ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Punjab':         ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Haryana':        ['Gurugram', 'Faridabad', 'Hisar', 'Panipat', 'Ambala'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'Bihar':          ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'Odisha':         ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
  };

  monthList = [
    { value: '01', label: 'January' },  { value: '02', label: 'February' },
    { value: '03', label: 'March' },    { value: '04', label: 'April' },
    { value: '05', label: 'May' },      { value: '06', label: 'June' },
    { value: '07', label: 'July' },     { value: '08', label: 'August' },
    { value: '09', label: 'September' },{ value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  yearList: string[] = [];
  statusList = ['Booked', 'Picked Up', 'In Transit', 'Delivered', 'Refunded'];

  // ── Status modal
  showModal      = false;
  selectedParcel: any = null;
  previousStatus = '';

  // ── Image modal
  imageModal       = false;
  imageModalParcel: any = null;
  fullImageUrl: string | null = null;

  // ── Invoice modal
  invoiceModal          = false;
  invoiceParcel: any    = null;
  isDownloadingInvoice  = false;

  // ── Download states
  isDownloadingExcel = false;
  isDownloadingPDF   = false;

 constructor(
  private parcelService: ParcelService,
  private route: ActivatedRoute
) {}
  ngOnInit(): void {
    this.buildYearList();
    this.stateList = Object.keys(this.stateCityMap);
    
 this.route.paramMap.subscribe(params => {
  const status = params.get('status') || 'active';
  this.currentRouteStatus = status;
  this.loadParcels(status);

});
  }

  buildYearList(): void {
    const y = new Date().getFullYear();
    for (let i = y; i >= y - 4; i--) this.yearList.push(String(i));
  }
loadParcels(type: string): void {
  this.parcelService.getParcels(type).subscribe({
      next: (res: any) => {
        this.parcels = res.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  /* ═══════════════════════════════════════════
     DROPDOWN TOGGLE
  ═══════════════════════════════════════════ */
  toggleDropdown(name: string): void {
    this.openDropdown = this.openDropdown === name ? null : name;
  }

  /* ═══════════════════════════════════════════
     TOGGLE ITEM IN MULTI-SELECT ARRAY
  ═══════════════════════════════════════════ */
  toggleItem(arr: string[], value: string): void {
    const i = arr.indexOf(value);
    i === -1 ? arr.push(value) : arr.splice(i, 1);
    this.applyFilters();
  }

  /* ═══════════════════════════════════════════
     STATE CHECKBOX — rebuilds city list
  ═══════════════════════════════════════════ */
  onStateCheckChange(state: string): void {
    this.toggleItem(this.selectedStates, state);
    // Rebuild available cities from all selected states
    this.availableCities = this.selectedStates
      .flatMap(s => this.stateCityMap[s] || []);
    // Remove cities no longer valid
    this.selectedCities = this.selectedCities
      .filter(c => this.availableCities.includes(c));
    this.applyFilters();
  }

  /* ═══════════════════════════════════════════
     MASTER FILTER — multi-select version
  ═══════════════════════════════════════════ */
  applyFilters(): void {
    let data = [...this.parcels];

    if (this.selectedMonths.length) {
      data = data.filter(p =>
        this.selectedMonths.includes(
          String(new Date(p.createdAt).getMonth() + 1).padStart(2, '0')
        )
      );
    }

    if (this.selectedYears.length) {
      data = data.filter(p =>
        this.selectedYears.includes(
          String(new Date(p.createdAt).getFullYear())
        )
      );
    }

    if (this.selectedStatuses.length) {
      data = data.filter(p => this.selectedStatuses.includes(p.current_status));
    }

    if (this.selectedPayments.length) {
      data = data.filter(p => this.selectedPayments.includes(p.payment_status));
    }

    if (this.selectedStates.length) {
      data = data.filter(p =>
        this.selectedStates.includes((p.sender_state || '').trim())
      );
    }

    if (this.selectedCities.length) {
      data = data.filter(p =>
        this.selectedCities.includes((p.sender_city || '').trim())
      );
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toUpperCase();
      data = data.filter(p =>
        p.tracking_id?.toUpperCase().includes(q)        ||
        p.sender_name?.toUpperCase().includes(q)        ||
        p.receiver_name?.toUpperCase().includes(q)      ||
        p.pickup_address?.toUpperCase().includes(q)     ||
        p.drop_address?.toUpperCase().includes(q)       ||
        p.sender_city?.toUpperCase().includes(q)        ||
        p.sender_state?.toUpperCase().includes(q)       ||
        p.receiver_city?.toUpperCase().includes(q)      ||
        p.receiver_state?.toUpperCase().includes(q)     ||
        p.sender_phone?.toUpperCase().includes(q)       ||
        p.receiver_phone?.toUpperCase().includes(q)     ||
        p.parcel_type?.toUpperCase().includes(q)        ||
        p.parcel_weight?.toString().includes(q)         ||
        p.distance_category?.toUpperCase().includes(q)  ||
        p.delivery_type?.toUpperCase().includes(q)      ||
        p.total_cost?.toString().includes(q)            ||
        p.payment_status?.toUpperCase().includes(q)     ||
        p.current_status?.toUpperCase().includes(q)
      );
    } else {
      this.searchResult = null;
    }

    this.filteredParcels = data;
  }

  /* ═══════════════════════════════════════════
     CLEAR ALL FILTERS
  ═══════════════════════════════════════════ */
  clearFilters(): void {
    this.selectedMonths   = [];
    this.selectedYears    = [];
    this.selectedStatuses = [];
    this.selectedPayments = [];
    this.selectedStates   = [];
    this.selectedCities   = [];
    this.availableCities  = [];
    this.searchQuery      = '';
    this.searchResult     = null;
    this.openDropdown     = null;
    this.filteredParcels  = [...this.parcels];
  }

  /* ═══════════════════════════════════════════
     HAS ACTIVE FILTERS
  ═══════════════════════════════════════════ */
  get hasActiveFilters(): boolean {
    return !!(
      this.selectedMonths.length   ||
      this.selectedYears.length    ||
      this.selectedStatuses.length ||
      this.selectedPayments.length ||
      this.selectedStates.length   ||
      this.selectedCities.length
    );
  }

  /* ═══════════════════════════════════════════
     SEARCH HANDLERS
  ═══════════════════════════════════════════ */
  onSearch(value: string): void {
    this.searchQuery = value;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery  = '';
    this.searchResult = null;
    this.applyFilters();
  }

  /* ═══════════════════════════════════════════
     IMAGE HELPERS
  ═══════════════════════════════════════════ */
  openImageModal(p: any)  { this.imageModalParcel = p; this.imageModal = true; }
  closeImageModal()       { this.imageModal = false; this.fullImageUrl = null; }
  openFullImage(f: string){ this.fullImageUrl = this.getImageUrl(f); }
  closeFullImage()        { this.fullImageUrl = null; }

  getImageUrl(f: string): string {
    return `${environment.apiUrl}/uploads/parcels/${f}`;
  }

  onImageError(e: Event) {
    (e.target as HTMLImageElement).src = 'assets/images/no-image.png';
  }

  /* ═══════════════════════════════════════════
     STATUS UPDATE
  ═══════════════════════════════════════════ */
  onStatusChange(parcel: any, status: string): void {
    this.previousStatus      = parcel.current_status;
    parcel.current_status    = status;
    this.selectedParcel      = parcel;
    this.showModal           = true;
  }

  confirmChange(status: string): void {
    this.parcelService.updateStatus(this.selectedParcel.tracking_id, status).subscribe({
      next: () => this.loadParcels(this.currentRouteStatus),
      error: () => {
        this.selectedParcel.current_status = this.previousStatus;
        alert('Status update failed');
      }
    });
    this.showModal = false;
  }

  cancelChange(): void {
    if (this.selectedParcel) this.selectedParcel.current_status = this.previousStatus;
    this.showModal = false;
  }

  /* ═══════════════════════════════════════════
     INVOICE MODAL
  ═══════════════════════════════════════════ */
  openInvoiceModal(parcel: any): void {
    this.invoiceParcel = parcel;
    this.invoiceModal  = true;
  }

  closeInvoiceModal(): void {
    this.invoiceModal         = false;
    this.invoiceParcel        = null;
    this.isDownloadingInvoice = false;
  }

  downloadInvoicePDF(parcel: any): void {
    if (!parcel) return;
    this.isDownloadingInvoice = true;

    this.parcelService.downloadInvoice(parcel.tracking_id).subscribe({
      next: (blob: Blob) => {
        const url  = window.URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `Invoice_${parcel.tracking_id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isDownloadingInvoice = false;
      },
      error: () => {
        alert('Failed to generate invoice. Please try again.');
        this.isDownloadingInvoice = false;
      }
    });
  }

  /* ═══════════════════════════════════════════
     BULK DOWNLOADS
  ═══════════════════════════════════════════ */
  downloadExcel(): void {
    this.isDownloadingExcel = true;
    const filters = this.buildFilterPayload();

    this.parcelService.downloadExcel(filters).subscribe({
      next: (blob: Blob) => {
        const url  = window.URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'parcels-report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.isDownloadingExcel = false;
      },
      error: () => {
        alert('Failed to download Excel. Please try again.');
        this.isDownloadingExcel = false;
      }
    });
  }

  downloadPDF(): void {
    this.isDownloadingPDF = true;
    const filters = this.buildFilterPayload();

    this.parcelService.downloadPDF(filters).subscribe({
      next: (blob: Blob) => {
        const url  = window.URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'parcels-report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.isDownloadingPDF = false;
      },
      error: () => {
        alert('Failed to download PDF. Please try again.');
        this.isDownloadingPDF = false;
      }
    });
  }

  private buildFilterPayload(): any {
    return {
      current_status: this.selectedStatuses.length ? this.selectedStatuses : undefined,
      payment_status: this.selectedPayments.length ? this.selectedPayments : undefined,
      month:          this.selectedMonths.length   ? this.selectedMonths   : undefined,
      year:           this.selectedYears.length    ? this.selectedYears    : undefined,
      state:          this.selectedStates.length   ? this.selectedStates   : undefined,
      city:           this.selectedCities.length   ? this.selectedCities   : undefined,
    };
  }
}