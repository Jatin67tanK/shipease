import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-track-parcel',
  templateUrl: './track-parcel.component.html'
})
export class TrackParcelComponent implements OnInit {

  trackingId = '';

  parcel: any = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private parcelService: ParcelService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    /* AUTO-FILL FROM SUCCESS / REDIRECT */
    this.route.queryParams.subscribe(params => {

      if (params['id']) {                //  CONSISTENT PARAM
        this.trackingId = params['id'];
        this.trackParcel();
      }

    });
  }

  trackParcel(): void {

    if (!this.trackingId.trim()) {
      this.errorMessage = 'Please enter a Tracking ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.parcel = null;

    /* 🚀 BACKEND API */
    this.parcelService.trackParcel(this.trackingId).subscribe({

      next: (res: any) => {

        /* NORMALIZE BACKEND → UI */
        this.parcel = {
          id: res.data.tracking_id,
          status: res.data.current_status,
          sender: res.data.sender_name,
          receiver: res.data.receiver_name,
          type: res.data.parcel_type
        };

        this.isLoading = false;
      },

      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Parcel not found';
        this.isLoading = false;
      }

    });
  }
}