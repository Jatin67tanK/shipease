import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-delivered-history',
  templateUrl: './delivered-history.component.html'
})
export class DeliveredHistoryComponent implements OnInit {

  parcels: any[] = [];
  isLoading = true;

  constructor(private parcelService: ParcelService) {}

  ngOnInit() {
    this.loadDelivered();
  }

  loadDelivered() {
    this.parcelService.getParcels('non-active').subscribe({
      next: (res: any) => {

        this.parcels = (res.data || [])
          .filter((p: any) => p.current_status === 'Delivered')
          .map((p: any) => ({
            id: p.tracking_id,
            sender: p.sender_name,
            receiver: p.receiver_name,
            type: p.parcel_type,
            status: p.current_status
          }));

        this.isLoading = false;
      },
      error: () => {
        this.parcels = [];
        this.isLoading = false;
      }
    });
  }
}