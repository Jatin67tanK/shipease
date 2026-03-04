import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-non-active-parcels',
  templateUrl: './non-active-parcels.component.html',
})
export class NonActiveParcelsComponent implements OnInit {

  parcels: any[] = [];
  filteredParcels: any[] = [];
  isLoading = true;

  // Search
  searchQuery = '';

  // Filter
  selectedMonth: string = '';
  selectedYear: string  = '';

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

  constructor(private parcelService: ParcelService) {}

  ngOnInit(): void {
    this.buildYearList();
    this.loadParcels();
  }

  buildYearList(): void {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 4; y--) {
      this.yearList.push(String(y));
    }
  }

  loadParcels(): void {
    this.isLoading = true;
    this.parcelService.getParcels('non-active').subscribe({
      next: (res: any) => {
        console.log("🔥 Admin Parcels:", res);
        this.parcels = res?.data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.warn("💀 Parcel Load Error:", err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.parcels];

    if (this.selectedMonth) {
      result = result.filter(p => {
        const d = new Date(p.createdAt);
        return String(d.getMonth() + 1).padStart(2, '0') === this.selectedMonth;
      });
    }

    if (this.selectedYear) {
      result = result.filter(p => {
        const d = new Date(p.createdAt);
        return String(d.getFullYear()) === this.selectedYear;
      });
    }

    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.tracking_id?.toLowerCase().includes(q)     ||
        p.sender_name?.toLowerCase().includes(q)     ||
        p.receiver_name?.toLowerCase().includes(q)   ||
        p.pickup_address?.toLowerCase().includes(q)  ||
        p.drop_address?.toLowerCase().includes(q)    ||
        p.current_status?.toLowerCase().includes(q)  ||
        p.parcel_type?.toLowerCase().includes(q)     ||
        p.sender_phone?.toLowerCase().includes(q)    ||
        p.receiver_phone?.toLowerCase().includes(q)  ||
        p.sender_city?.toLowerCase().includes(q)     ||
        p.sender_state?.toLowerCase().includes(q)    ||
        p.receiver_city?.toLowerCase().includes(q)   ||
        p.receiver_state?.toLowerCase().includes(q)
      );
    }

    this.filteredParcels = result;
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
    this.selectedMonth = '';
    this.selectedYear  = '';
    this.searchQuery   = '';
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return !!(this.selectedMonth || this.selectedYear || this.searchQuery);
  }
}