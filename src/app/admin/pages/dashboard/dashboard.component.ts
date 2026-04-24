import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  cards: any[] = [];

  constructor(private parcelService: ParcelService, private router:Router) {}

  ngOnInit(): void {
    this.loadStats();
  }
  goToPracel(title:string){
    if(title === 'Total Parcels' || title === 'Active Parcels')
      this.router.navigate(['/admin/parcels/active'])
    else 
      this.router.navigate(['//admin/parcels/non-active'])
  }
  
  loadStats(): void {

    this.parcelService.getAdminStats().subscribe({

      next: (res: any) => {

        const stats = res.data;

        this.cards = [
          {
            title: 'Total Parcels',
            value: stats.totalParcels,
            icon: 'fas fa-box',
            iconBg: 'bg-blue-100 text-blue-600'
          },
          {
            title: 'Active Parcels',
            value: stats.activeParcels,
            icon: 'fas fa-truck',
            iconBg: 'bg-green-100 text-green-600'
          },
          {
            title: 'Delivered Parcels',
            value: stats.deliveredParcels,
            icon: 'fas fa-check',
            iconBg: 'bg-green-100 text-green-600'
          },
          {
            title: 'Refunded Parcels',
            value: stats.refundedParcels,
            icon: 'fas fa-undo',
            iconBg: 'bg-orange-100 text-orange-600'
          }
        ];
      },

      error: () => {
        console.warn("Stats API Failed");
      }
    });
  }
}
