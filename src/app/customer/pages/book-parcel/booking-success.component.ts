import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html'
})
export class BookingSuccessComponent implements OnInit {

  trackingId = '';
  isLoading = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadTrackingId();
  }

  /* =====================================================
     ✅ SAFE TRACKING LOAD 😈🔥
  ===================================================== */

  loadTrackingId(): void {

    const storedId = localStorage.getItem('trackingId');

    if (!storedId) {
      this.router.navigate(['/customer']);
      return;
    }

    this.trackingId = storedId;

    /* ✅ Smooth UI transition */
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 250);
    });
  }

  /* =====================================================
     ✅ TRACK ACTION 😈🔥
  ===================================================== */

  trackParcel(): void {

    if (!this.trackingId) {
      alert("Tracking ID missing 😑");
      return;
    }

    /* ✅ Clean success state (optional but smart) */
    localStorage.removeItem('trackingId');

    this.router.navigate(
      ['/customer/track'],
      { queryParams: { trackingId: this.trackingId } }
    );
  }

  /* =====================================================
     ✅ DASHBOARD ACTION (Optional UX)
  ===================================================== */

  goToDashboard(): void {
    this.router.navigate(['/customer']);
  }
}