import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ParcelService }     from 'src/app/core/services/parcel.service';
import { AuthService }       from 'src/app/core/services/auth.service';
import { take }              from 'rxjs/operators';

declare var Razorpay: any;

@Component({
  selector:    'app-checkout',
  templateUrl: './checkout.component.html'
  // ✅ No styleUrls — pure Tailwind
})
export class CheckoutComponent implements OnInit {

  booking: any = null;

  /* ── Pricing config from GET /pricing ── */
  pricingConfig: any = null;

  /* ── Each line item shown in UI ── */
  lineItems: {
    label:      string;
    desc:       string;
    icon:       string;
    amount:     number;
    highlight?: 'express' | 'free' | null;
  }[] = [];

  totalPayable                          = 0;
  selectedMethod: 'card' | 'upi' | 'bank' = 'card';
  isLoading                             = true;
  isPaying                              = false;
  paymentError                          = '';   // ← fixes the template error

  constructor(
    private parcelService: ParcelService,
    private authService:   AuthService,
    private router:        Router
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
  ═══════════════════════════════════════════ */
  buildLineItems(): void {
    const cfg     = this.pricingConfig;
    const weight  = Number(this.booking.parcel_weight) || 0;
    const distCat = this.booking.distance_category as string;
    const delType = this.booking.delivery_type     as string;

    let basePrice = cfg.local_base_price;
    if (distCat === 'Intercity')     basePrice = cfg.intercity_base_price;
    if (distCat === 'Interstate')    basePrice = cfg.interstate_base_price;
    if (distCat === 'International') basePrice = cfg.international_base_price;

    const weightCharge  = weight * cfg.price_per_kg;
    const isExpress     = delType === 'Express Delivery';
    const expressCharge = isExpress ? cfg.express_delivery_extra_charge : 0;

    this.lineItems = [
      {
        label:     `${distCat} Base Rate`,
        desc:      this.getDistanceDesc(distCat),
        icon:      this.getDistanceIcon(distCat),
        amount:    basePrice,
        highlight: null
      },
      {
        label:     'Weight Charge',
        desc:      `${weight} kg × $${cfg.price_per_kg.toFixed(2)}/kg`,
        icon:      'fas fa-weight-hanging',
        amount:    weightCharge,
        highlight: null
      },
      {
        label:     'Express Delivery',
        desc:      isExpress ? 'Priority handling & faster transit' : 'Standard delivery — no surcharge',
        icon:      isExpress ? 'fas fa-bolt' : 'fas fa-truck',
        amount:    expressCharge,
        highlight: isExpress ? 'express' : 'free'
      }
    ];

    this.totalPayable = basePrice + weightCharge + expressCharge;
  }

  private getDistanceDesc(cat: string): string {
    const map: Record<string, string> = {
      'Local':         'Within city delivery',
      'Intercity':     'Between cities, same state',
      'Interstate':    'Cross-state delivery',
      'International': 'Cross-border international'
    };
    return map[cat] ?? 'Delivery base charge';
  }

  private getDistanceIcon(cat: string): string {
    const map: Record<string, string> = {
      'Local':         'fas fa-city',
      'Intercity':     'fas fa-road',
      'Interstate':    'fas fa-map',
      'International': 'fas fa-plane'
    };
    return map[cat] ?? 'fas fa-box';
  }

  /* ═══════════════════════════════════════════
     Payment Method Selection
  ═══════════════════════════════════════════ */
  selectMethod(method: 'card' | 'upi' | 'bank'): void {
    this.selectedMethod = method;
  }

  /* ═══════════════════════════════════════════
     PROCEED TO PAY — Full Razorpay flow
  ═══════════════════════════════════════════ */
  proceedToPay(): void {
    if (this.isPaying) return;

    if (!this.booking?._id) {
      alert('Parcel ID missing. Please re-book.');
      return;
    }

    this.isPaying     = true;
    this.paymentError = '';

    const amountInPaise = Math.round(this.totalPayable * 100);

    // ── Step 1: Create Razorpay order on your backend ────
    this.parcelService.createPaymentOrder(this.booking._id, amountInPaise)
      .subscribe({
        next: async (order) => {
          try {
            // ── Step 2: Get customer prefill from profile$ ──
            const profile = await this.authService.profile$
              .pipe(take(1))
              .toPromise();

            // ── Step 3: Open Razorpay modal ───────────────
            const result = await this.openRazorpay({
              orderId:       order.id,
              amount:        order.amount,
              currency:      order.currency ?? 'INR',
              customerName:  profile?.name  ?? this.booking.sender_name  ?? '',
              customerEmail: profile?.email ?? '',
              customerPhone: profile?.phone ?? this.booking.sender_phone ?? ''
            });

            // ── Step 4: Verify signature on backend ───────
            this.parcelService.verifyPayment({
              razorpay_order_id:   result.razorpay_order_id,
              razorpay_payment_id: result.razorpay_payment_id,
              razorpay_signature:  result.razorpay_signature,
              bookingId:           this.booking._id
            }).subscribe({
              next: (res: any) => {
                localStorage.removeItem('booking');

                // ── Step 5: Navigate to success page ──────
                this.router.navigate(['/customer/book/success'], {
                  state: {
                    paymentId:  result.razorpay_payment_id,
                    orderId:    result.razorpay_order_id,
                    bookingId:  this.booking._id,
                    amount:     this.totalPayable,
                    trackingId: res?.data?.tracking_id
                               ?? localStorage.getItem('trackingId')
                               ?? ''
                  }
                });
              },
              error: () => {
                this.paymentError = 'Payment verification failed. Please contact support with your Payment ID: ' + result.razorpay_payment_id;
                this.isPaying     = false;
              }
            });

          } catch (err: any) {
            // Cancelled by user or card/UPI failure
            this.paymentError = err.code === 'DISMISSED'
              ? 'Payment was cancelled. You can try again.'
              : `Payment failed: ${err.message ?? 'Please try a different payment method.'}`;
            this.isPaying = false;
          }
        },

        error: (err) => {
          this.paymentError = err?.error?.message
            ?? 'Could not initiate payment. Please try again.';
          this.isPaying = false;
        }
      });
  }

  /* ═══════════════════════════════════════════
     Razorpay modal — Promise wrapper
  ═══════════════════════════════════════════ */
  private openRazorpay(config: {
    orderId:       string;
    amount:        number;
    currency:      string;
    customerName:  string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<any> {
    return new Promise((resolve, reject) => {

      const options = {
        key:         'rzp_test_STLxKcGEohnOty',   
        amount:      config.amount,
        currency:    config.currency,
        name:        'SwiftEdge Logistics',
        description: 'Parcel Delivery Payment',
        order_id:    config.orderId,
        prefill: {
          name:    config.customerName,
          email:   config.customerEmail,
          contact: config.customerPhone
        },
        theme:   { color: '#16A34A' },
        handler: (response: any) => resolve(response),
        modal:   {
          ondismiss: () => reject({ code: 'DISMISSED', message: 'Payment cancelled by user' })
        }
      };

      const rzp = new Razorpay(options);

      rzp.on('payment.failed', (res: any) => reject({
        code:    res.error.code,
        message: res.error.description
      }));

      rzp.open();
    });
  }
}