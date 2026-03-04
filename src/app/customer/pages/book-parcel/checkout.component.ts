import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
  // ✅ No styleUrls — pure Tailwind
})
export class CheckoutComponent implements OnInit {

  booking: any = null;

  /* ── Pricing config from GET /pricing ── */
  pricingConfig: any = null;

  /* ── Each line item shown in UI ── */
  lineItems: {
    label: string;
    desc: string;
    icon: string;
    amount: number;
    highlight?: 'express' | 'free' | null;
  }[] = [];

  totalPayable   = 0;
  selectedMethod: 'card' | 'upi' | 'bank' = 'card';
  isLoading      = true;
  isPaying       = false;

  constructor(
    private parcelService: ParcelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooking();
  }

  /* ═══════════════════════════════════════════
     STEP 1 — Load booking from localStorage
  ═══════════════════════════════════════════ */
  loadBooking(): void {

    const stored = localStorage.getItem('booking');

    if (!stored) {
      this.router.navigate(['/customer/book']);
      return;
    }

    try {
      this.booking = JSON.parse(stored);
    } catch {
      localStorage.removeItem('booking');
      this.router.navigate(['/customer/book']);
      return;
    }

    if (!this.booking?.parcel_weight || !this.booking?.distance_category) {
      alert('Invalid booking data. Please re-book.');
      this.router.navigate(['/customer/book']);
      return;
    }

    this.fetchPricingAndCalculate();
  }

  /* ═══════════════════════════════════════════
     STEP 2 — Fetch GET /pricing config
     then calculate all line items on frontend
  ═══════════════════════════════════════════ */
  fetchPricingAndCalculate(): void {

    this.parcelService.getPricing().subscribe({

      next: (res: any) => {
        this.pricingConfig = res?.data ?? res;
        this.buildLineItems();
        this.isLoading = false;
      },

      error: (err) => {
        console.warn('Pricing API failed, using defaults:', err);
        /* ── Hardcoded defaults matching your backend ── */
        this.pricingConfig = {
          local_base_price:              15,
          intercity_base_price:          45,
          interstate_base_price:         85,
          international_base_price:      210,
          price_per_kg:                  2.5,
          express_delivery_extra_charge: 25
        };
        this.buildLineItems();
        this.isLoading = false;
      }
    });
  }

  /* ═══════════════════════════════════════════
     STEP 3 — Build every line item from config
     Matches your backend bookParcel logic exactly
  ═══════════════════════════════════════════ */
  buildLineItems(): void {

    const cfg      = this.pricingConfig;
    const weight   = Number(this.booking.parcel_weight) || 0;
    const distCat  = this.booking.distance_category as string;
    const delType  = this.booking.delivery_type     as string;

    /* ── 1. Distance base price ── */
    let basePrice = cfg.local_base_price;
    if (distCat === 'Intercity')     basePrice = cfg.intercity_base_price;
    if (distCat === 'Interstate')    basePrice = cfg.interstate_base_price;
    if (distCat === 'International') basePrice = cfg.international_base_price;

    /* ── 2. Weight charge ── */
    const weightCharge = weight * cfg.price_per_kg;

    /* ── 3. Express surcharge ── */
    const isExpress    = delType === 'Express Delivery';
    const expressCharge = isExpress ? cfg.express_delivery_extra_charge : 0;

    /* ── Build line items array ── */
    this.lineItems = [

      {
        label: `${distCat} Base Rate`,
        desc:  this.getDistanceDesc(distCat),
        icon:  this.getDistanceIcon(distCat),
        amount: basePrice,
        highlight: null
      },

      {
        label: 'Weight Charge',
        desc:  `${weight} kg × $${cfg.price_per_kg.toFixed(2)}/kg`,
        icon:  '⚖️',
        amount: weightCharge,
        highlight: null
      },

      {
        label: 'Express Delivery',
        desc:  isExpress ? 'Priority handling & faster transit' : 'Standard delivery — no surcharge',
        icon:  isExpress ? '🚀' : '🚚',
        amount: expressCharge,
        highlight: isExpress ? 'express' : 'free'
      }
    ];

    /* ── Total ── */
    this.totalPayable = basePrice + weightCharge + expressCharge;
  }

  /* ── Helper: distance description ── */
  private getDistanceDesc(cat: string): string {
    const map: Record<string, string> = {
      'Local':         'Within city delivery',
      'Intercity':     'Between cities, same state',
      'Interstate':    'Cross-state delivery',
      'International': 'Cross-border international'
    };
    return map[cat] ?? 'Delivery base charge';
  }

  /* ── Helper: distance icon ── */
  private getDistanceIcon(cat: string): string {
    const map: Record<string, string> = {
      'Local':         '🏙️',
      'Intercity':     '🌆',
      'Interstate':    '🗺️',
      'International': '✈️'
    };
    return map[cat] ?? '📦';
  }

  /* ═══════════════════════════════════════════
     Payment Method Selection
  ═══════════════════════════════════════════ */
  selectMethod(method: 'card' | 'upi' | 'bank'): void {
    this.selectedMethod = method;
  }

  /* ═══════════════════════════════════════════
     Proceed to Pay
     ── Currently: finalBooking (mock flow)
     ── TODO: swap for Razorpay / Stripe
  ═══════════════════════════════════════════ */
  proceedToPay(): void {

    if (this.isPaying) return;

    if (!this.booking?._id) {
      alert('Parcel ID missing. Please re-book.');
      return;
    }

    this.isPaying = true;

    /* ════════════════════════════════════════
       🔧 GATEWAY HOOK — replace when ready:

       RAZORPAY:
       this.parcelService.createRazorpayOrder(this.totalPayable)
         .subscribe(order => this.openRazorpay(order));

       STRIPE:
       this.parcelService.createStripeIntent(this.totalPayable)
         .subscribe(intent => this.openStripe(intent.clientSecret));
    ════════════════════════════════════════ */

    setTimeout(() => {

      this.parcelService.finalBooking(this.booking._id).subscribe({

        next: (res: any) => {

          if (!res?.data?.tracking_id) {
            alert('Invalid payment response. Please try again.');
            this.isPaying = false;
            return;
          }

          localStorage.setItem('trackingId', res.data.tracking_id);
          localStorage.removeItem('booking');
          this.router.navigate(['/customer/book/success']);
        },

        error: (err) => {
          console.error('Payment error:', err);
          alert(err?.error?.message || 'Payment failed. Please try again.');
          this.isPaying = false;
        }
      });

    }, 900);
  }

  /* ═══════════════════════════════════════════
     RAZORPAY — uncomment & fill key when ready
  ═══════════════════════════════════════════ */
  /*
  private openRazorpay(order: any): void {
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID',
      amount: order.amount,
      currency: 'USD',
      name: 'SwiftEdge Logistics',
      description: 'Parcel Delivery Payment',
      order_id: order.id,
      handler: (response: any) => {
        this.parcelService.verifyPayment(response).subscribe(() => {
          localStorage.setItem('trackingId', order.tracking_id);
          localStorage.removeItem('booking');
          this.router.navigate(['/customer/book/success']);
        });
      },
      prefill: {
        name:    this.booking?.sender_name  || '',
        contact: this.booking?.sender_phone || ''
      },
      theme: { color: '#2563eb' }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    this.isPaying = false;
  }
  */
}