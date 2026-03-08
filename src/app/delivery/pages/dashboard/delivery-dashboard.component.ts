import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-delivery-dashboard',
  templateUrl: './delivery-dashboard.component.html'
})
export class DeliveryDashboardComponent implements OnInit {

  profile: any = null;
  stats: any = { total: 0, pickedUp: 0, inTransit: 0, outForDelivery: 0, delivered: 0 };
  recentParcels: any[] = [];
  isLoading = true;

  statCards = [
    { key: 'total',          label: 'Total Assigned', icon: '📦', color: 'bg-slate-50 text-slate-700',  border: 'border-slate-200' },
    { key: 'pickedUp',       label: 'Picked Up',      icon: '🛻', color: 'bg-blue-50 text-blue-700',   border: 'border-blue-200' },
    { key: 'inTransit',      label: 'In Transit',     icon: '🔄', color: 'bg-yellow-50 text-yellow-700', border: 'border-yellow-200' },
    { key: 'outForDelivery', label: 'Out for Delivery',icon: '🚴', color: 'bg-orange-50 text-orange-700', border: 'border-orange-200' },
    { key: 'delivered',      label: 'Delivered',      icon: '✅', color: 'bg-green-50 text-green-700',  border: 'border-green-200' },
  ];

  constructor(
    private parcelService: ParcelService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getEmployeeProfile().subscribe({
      next: (res: any) => { this.profile = res.data; }
    });
    this.parcelService.getEmployeeStats().subscribe({
      next: (res: any) => { this.stats = res.data; }
    });
    this.parcelService.getAssignedParcels().subscribe({
      next: (res: any) => {
        this.recentParcels = (res.data || []).slice(0, 5);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Booked': 'bg-slate-100 text-slate-700',
      'Picked Up': 'bg-blue-100 text-blue-700',
      'In Transit': 'bg-yellow-100 text-yellow-700',
      'Out for Delivery': 'bg-orange-100 text-orange-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
}
