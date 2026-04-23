import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-track-parcel',
  templateUrl: './track-parcel.component.html'
})
export class TrackParcelComponent implements OnInit {

  trackingId = '';

  isLoading = false;
  parcel: any = null;
  parcelEvents: any[] = [];

  errorMessage = '';

  /* ✅ Progress Engine */
  progressStep = 1;
  progressWidth = 0;

  constructor(
    private parcelService: ParcelService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    /* 😈🔥 AUTO-FILL FROM SUCCESS PAGE */
    this.route.queryParams.subscribe(params => {

      if (params['trackingId']) {
        this.trackingId = params['trackingId'];
        this.trackParcel();
      }
    });
  }

  /* =====================================================
     ✅ TRACK PARCEL 😈🔥
  ===================================================== */

  trackParcel(): void {

    if (this.isLoading) return;

    if (!this.trackingId.trim()) {
      this.errorMessage = 'Please enter a Tracking ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.parcel = null;
    this.parcelEvents = [];

    const tracking = this.trackingId.trim();

    /* 🚀 MAIN PARCEL FETCH */
    this.parcelService.trackParcel(tracking).subscribe({

      next: (res: any) => {

        if (!res?.data) {
          this.handleError('Invalid server response');
          return;
        }

        const p = res.data;

        /* ✅ RAW BACKEND DATA */
        this.parcel = p;

        /* ✅ Progress Calculation */
        this.progressStep = this.calculateProgress(p.current_status);
        this.progressWidth = (this.progressStep - 1) * 33.33;

        /* 😈🔥 FETCH TIMELINE EVENTS */
        this.loadParcelEvents(tracking);
      },

      error: (err) => {
        this.handleError(
          err?.error?.message || 'Parcel not found'
        );
      }
    });
  }

  /* =====================================================
     ✅ LOAD TRACKING EVENTS 😈🔥
  ===================================================== */

  loadParcelEvents(trackingId: string): void {
    this.parcelService.getParcelEvents(trackingId).subscribe({
      next: (res: any) => {
        this.parcelEvents = res?.data || [];
        this.isLoading = false;
      },
      error: () => {
        /* Not critical → UI still works */
        this.parcelEvents = [];
        this.isLoading = false;
      }
    });
  }

  /* =====================================================
     ✅ STATUS → PROGRESS ENGINE 😈🔥
  ===================================================== */

  calculateProgress(status: string): number {

    switch (status) {
      case 'Booked': return 1;
      case 'Picked Up': return 2;
      case 'In Transit': return 3;
      case 'Out for Delivery': return 3.5;
      case 'Delivered': return 4;
      default: return 1;
    }
  }

  /* =====================================================
     ✅ ERROR HANDLER 😈🔥
  ===================================================== */

  handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.parcel = null;
    this.parcelEvents = [];
    this.progressStep = 1;
    this.progressWidth = 0;
  }

  bookNow(): void {
    if (this.authService.isLoggedIn() && this.authService.getRole() === 'Customer') {
      this.router.navigate(['/customer/book']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}