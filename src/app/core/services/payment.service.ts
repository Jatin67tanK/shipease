// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var Razorpay: any;

export interface RazorpayConfig {
  orderId: string;
  amount: number;        // in paise
  currency?: string;
  bookingId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
}

export interface PaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {

  // Key ID only — safe on frontend
  // Add this to src/environments/environment.ts:
  // razorpayKeyId: 'rzp_test_XXXXXXXXXXXXXXX'
  private keyId = environment.razorpayKeyId;

  constructor(private router: Router) {}

  /**
   * Opens the Razorpay checkout modal.
   * Returns a Promise that resolves with payment IDs on success,
   * or rejects with an error object on failure/dismiss.
   */
  openCheckout(config: RazorpayConfig): Promise<PaymentResult> {
    return new Promise((resolve, reject) => {

      const options = {
        key:         this.keyId,
        amount:      config.amount,
        currency:    config.currency ?? 'INR',
        name:        'ShipEase',
        description: config.description ?? 'Parcel Booking Payment',
        order_id:    config.orderId,
        image:       'assets/logo.png',  // your logo path

        prefill: {
          name:    config.customerName  ?? '',
          email:   config.customerEmail ?? '',
          contact: config.customerPhone ?? ''
        },

        notes: {
          bookingId: config.bookingId   // passed through to your backend
        },

        theme: { color: '#3399cc' },

        // ✅ Success
        handler: (response: PaymentResult) => resolve(response),

        // ❌ Modal closed / dismissed
        modal: {
          ondismiss: () => reject({ code: 'DISMISSED', message: 'Payment cancelled by user' })
        }
      };

      const rzp = new Razorpay(options);

      // ❌ Payment failed inside modal (wrong card, etc.)
      rzp.on('payment.failed', (response: any) => {
        reject({
          code:    response.error.code,
          message: response.error.description
        });
      });

      rzp.open();
    });
  }
}