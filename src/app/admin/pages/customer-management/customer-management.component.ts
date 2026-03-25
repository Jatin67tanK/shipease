import { Component, OnInit, HostListener } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html'
})
export class CustomerManagementComponent implements OnInit {

  // ── Data ──────────────────────────────────────────────────
  allCustomers: any[]      = [];
  filteredCustomers: any[] = [];
  isLoading                = true;

  // ── Search ────────────────────────────────────────────────
  searchQuery = '';

  // ── Filters ───────────────────────────────────────────────
  openDropdown: string | null = null;

  selectedStatuses: string[] = [];   // Active | Inactive
  selectedMonths:   string[] = [];   // '1'..'12'
  selectedYears:    number[] = [];
  selectedStates:   string[] = [];
  selectedCities:   string[] = [];

  readonly statusList  = ['Active', 'Inactive'];
  readonly monthList   = [
    { label: 'January',   value: '1'  }, { label: 'February',  value: '2'  },
    { label: 'March',     value: '3'  }, { label: 'April',     value: '4'  },
    { label: 'May',       value: '5'  }, { label: 'June',      value: '6'  },
    { label: 'July',      value: '7'  }, { label: 'August',    value: '8'  },
    { label: 'September', value: '9'  }, { label: 'October',   value: '10' },
    { label: 'November',  value: '11' }, { label: 'December',  value: '12' }
  ];
  yearList: number[] = [];

  readonly stateList = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
    'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
    'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Delhi','Jammu & Kashmir','Ladakh','Puducherry'
  ];

  readonly stateCityMap: Record<string, string[]> = {
    'Gujarat':     ['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar'],
    'Maharashtra': ['Mumbai','Pune','Nagpur','Nashik','Aurangabad'],
    'Delhi':       ['New Delhi','Dwarka','Rohini','Saket'],
    'Karnataka':   ['Bengaluru','Mysuru','Hubli','Mangaluru'],
    'Tamil Nadu':  ['Chennai','Coimbatore','Madurai','Tiruchirappalli'],
    'Rajasthan':   ['Jaipur','Jodhpur','Udaipur','Kota','Ajmer'],
    'Uttar Pradesh':['Lucknow','Kanpur','Varanasi','Agra','Prayagraj'],
    'West Bengal': ['Kolkata','Howrah','Durgapur','Siliguri'],
  };

  get availableCities(): string[] {
    const cities: string[] = [];
    this.selectedStates.forEach(s => {
      (this.stateCityMap[s] || []).forEach(c => { if (!cities.includes(c)) cities.push(c); });
    });
    return cities;
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedStatuses.length ||
              this.selectedMonths.length || this.selectedYears.length ||
              this.selectedStates.length || this.selectedCities.length);
  }

  // ── Toggle confirm modal ──────────────────────────────────
  showConfirmModal  = false;
  confirmTarget: any = null;   // customer being toggled
  isToggling        = false;
  toggleResult: { success: boolean; message: string } | null = null;

  // ── Stats ─────────────────────────────────────────────────
  get totalCustomers()    { return this.allCustomers.length; }
  get activeCustomers()   { return this.allCustomers.filter( c => c.status === 'Active').length; }
  get inactiveCustomers() { return this.allCustomers.filter(c => c.status === 'Inactive').length; }

  constructor(private parcelService: ParcelService) {}

  ngOnInit(): void {
    const cur = new Date().getFullYear();
    this.yearList = [cur, cur - 1, cur - 2, cur - 3];
    this.loadCustomers();
  }

  // ── Load ─────────────────────────────────────────────────
  loadCustomers(): void {
    this.isLoading = true;
    this.parcelService.getAllCustomers().subscribe({
      next: (res: any) => {
        this.allCustomers      = res.data || [];
        this.filteredCustomers = [...this.allCustomers];
        this.isLoading         = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  // ── Search & filter (all frontend) ───────────────────────
  applyFilters(): void {
    let list = [...this.allCustomers];

    // search: name, email, phone
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name?.toLowerCase().includes(q)  ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      );
    }

    // status
    if (this.selectedStatuses.length) {
      list = list.filter(c => {
        const s = c.status;   // already 'Active' or 'Inactive' from backend
        return this.selectedStatuses.includes(s);
      });
    }

    // month joined
    if (this.selectedMonths.length) {
      list = list.filter(c => {
        const m = String(new Date(c.createdAt).getMonth() + 1);
        return this.selectedMonths.includes(m);
      });
    }

    // year joined
    if (this.selectedYears.length) {
      list = list.filter(c => {
        const y = new Date(c.createdAt).getFullYear();
        return this.selectedYears.includes(y);
      });
    }

    this.filteredCustomers = list;
  }

  onSearch(val: string): void  { this.searchQuery = val; this.applyFilters(); }
  clearSearch(): void          { this.searchQuery = ''; this.applyFilters(); }

  toggleItem(arr: any[], val: any): void {
    const i = arr.indexOf(val);
    i === -1 ? arr.push(val) : arr.splice(i, 1);
    this.applyFilters();
  }

  toggleDropdown(name: string): void {
    this.openDropdown = this.openDropdown === name ? null : name;
  }

  clearFilters(): void {
    this.searchQuery      = '';
    this.selectedStatuses = [];
    this.selectedMonths   = [];
    this.selectedYears    = [];
    this.selectedStates   = [];
    this.selectedCities   = [];
    this.applyFilters();
  }

  @HostListener('document:click')
  onDocClick(): void { this.openDropdown = null; }

  // ── Toggle Customer Status ────────────────────────────────
  openConfirm(customer: any): void {
    this.confirmTarget  = customer;
    this.toggleResult   = null;
    this.showConfirmModal = true;
  }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    this.isToggling  = true;
    this.toggleResult = null;

    this.parcelService.toggleCustomerStatus(this.confirmTarget._id).subscribe({
      next: (res: any) => {
        // Update local state
        const idx = this.allCustomers.findIndex(c => c._id === this.confirmTarget._id);
        if (idx !== -1) {
          this.allCustomers[idx].status = res.data.status;
        }
        this.applyFilters();
        this.toggleResult = {
          success: true,
          message: res.message || `Account ${res.data.status === 'Active' ? 'activated' : 'deactivated'} successfully. Email sent to customer.`
        };
        this.isToggling = false;
      },
      error: (err) => {
        this.toggleResult = {
          success: false,
          message: err?.error?.message || 'Operation failed'
        };
        this.isToggling = false;
      }
    });
  }

  closeConfirm(): void {
    this.showConfirmModal = false;
    this.confirmTarget    = null;
    this.toggleResult     = null;
  }

  getInitials(name: string): string {
    return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}