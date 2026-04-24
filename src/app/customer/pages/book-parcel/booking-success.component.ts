import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html'
})
export class BookingSuccessComponent implements OnInit {

  trackingId = '';
  isLoading  = true;
  role       = '';

  // ── Razorpay payment details (populated after real payment) ──
  paymentId  = '';   // razorpay_payment_id
  orderId    = '';   // razorpay_order_id
  amount     = 0;    // in rupees/dollars (already divided from paise)
  bookingId  = '';
  isPaidFlow = false; // true = came from Razorpay, false = old mock flow

  constructor(private router: Router) {
    // ── Read Razorpay state passed from checkout.component.ts ──
    // Must be read in constructor — router state is only available here
    const nav   = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    if (state?.paymentId) {
      this.isPaidFlow = true;
      this.paymentId  = state.paymentId  ?? '';
      this.orderId    = state.orderId    ?? '';
      this.amount     = state.amount     ?? 0;
      this.bookingId  = state.bookingId  ?? '';
      // trackingId may come from backend response via state,
      // or fall back to localStorage set by finalBooking()
      this.trackingId = state.trackingId ?? localStorage.getItem('trackingId') ?? '';
    }
  }

  ngOnInit(): void {
    this.detectRole();

    if (this.isPaidFlow) {
      // Came from Razorpay — trackingId already set in constructor
      if (!this.trackingId && !this.paymentId) {
        this.redirectByRole();
        return;
      }
      requestAnimationFrame(() => {
        setTimeout(() => { this.isLoading = false; }, 250);
      });
    } else {
      // Old mock flow — read trackingId from localStorage
      this.loadTrackingId();
    }
  }

  detectRole(): void {
    const token = localStorage.getItem('token');
    try {
      this.role = JSON.parse(atob(token!.split('.')[1])).role;
    } catch {
      this.role = 'Customer';
    }
  }

  // ── Used only by old mock flow ────────────────────────────
  loadTrackingId(): void {
    const storedId = localStorage.getItem('trackingId');
    if (!storedId) {
      this.redirectByRole();
      return;
    }
    this.trackingId = storedId;
    requestAnimationFrame(() => {
      setTimeout(() => { this.isLoading = false; }, 250);
    });
  }

  private redirectByRole(): void {
    this.role === 'Admin'
      ? this.router.navigate(['/admin/dashboard'])
      : this.router.navigate(['/customer']);
  }

  trackParcel(): void {
    if (!this.trackingId) {
      alert('Tracking ID missing.');
      return;
    }
    localStorage.removeItem('trackingId');
    this.router.navigate(
      ['/customer/track'],
      { queryParams: { trackingId: this.trackingId } }
    );
  }

  goToDashboard(): void {
    this.role === 'Admin'
      ? this.router.navigate(['/admin/dashboard'])
      : this.router.navigate(['/customer']);
  }
}
