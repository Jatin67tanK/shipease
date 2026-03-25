import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {

  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef>;

  // OTP digits — 6 boxes
  digits: string[] = ['', '', '', '', '', ''];

  // State
  isLoading       = false;
  isSending       = false;
  errorMessage    = '';
  successMessage  = '';
  isVerified      = false;

  // Timer for resend cooldown (60s)
  resendCooldown  = 0;
  private timer: any;

  // Phone number to display (masked)
  phone           = '';

  // tempToken stored from login response
  private tempToken = '';

  private API = environment.apiUrl;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Read tempToken + phone from router state (set by login component)
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    if (state?.tempToken) {
      this.tempToken = state.tempToken;
      this.phone     = state.phone || '';
      // Auto-send OTP on page load
      this.sendOTP();
    } else {
      // If navigated directly without state, redirect to login
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  // ── OTP box input handling ────────────────────────────────

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val   = input.value.replace(/\D/g, '').slice(-1); // digits only
    this.digits[index] = val;

    if (val && index < 5) {
      // Move to next box
      const boxes = this.otpBoxes.toArray();
      boxes[index + 1]?.nativeElement.focus();
    }

    this.errorMessage = '';

    // Auto-submit when all 6 filled
    if (this.digits.every(d => d !== '')) {
      setTimeout(() => this.verifyOTP(), 100);
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      if (!this.digits[index] && index > 0) {
        const boxes = this.otpBoxes.toArray();
        this.digits[index - 1] = '';
        boxes[index - 1]?.nativeElement.focus();
      } else {
        this.digits[index] = '';
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      this.otpBoxes.toArray()[index - 1]?.nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < 5) {
      this.otpBoxes.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || '';
    pasted.split('').forEach((ch, i) => { this.digits[i] = ch; });
    // Focus last filled box
    const lastIdx = Math.min(pasted.length, 5);
    setTimeout(() => this.otpBoxes.toArray()[lastIdx]?.nativeElement.focus(), 0);
    if (pasted.length === 6) setTimeout(() => this.verifyOTP(), 150);
  }

  get otpValue(): string { return this.digits.join(''); }

  // ── Send OTP ──────────────────────────────────────────────

  sendOTP(): void {
    if (this.resendCooldown > 0) return;
    this.isSending     = true;
    this.errorMessage  = '';
    this.successMessage = '';

    this.http.post<any>(
      `${this.API}/api/otp/send-otp`, {},
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        this.isSending      = false;
        this.successMessage = 'OTP sent to your phone!';
        this.startCooldown();
      },
      error: (err) => {
        this.isSending    = false;
        this.errorMessage = err.error?.message || 'Failed to send OTP';
      }
    });
  }

  // ── Verify OTP ────────────────────────────────────────────

  verifyOTP(): void {
    if (this.otpValue.length !== 6) {
      this.errorMessage = 'Please enter all 6 digits'; return;
    }
    this.isLoading    = true;
    this.errorMessage = '';

    this.http.post<any>(
      `${this.API}/api/otp/verify-otp`,
      { otp: this.otpValue },
      { headers: this.authHeaders() }
    ).subscribe({
      next: () => {
        // OTP verified — now swap tempToken efor real JWT
        this.http.post<any>(
          `${this.API}/api/auth/verify-and-login`, {},
          { headers: this.authHeaders() }
        ).subscribe({
          next: (loginRes) => {
            this.isLoading  = false;
            this.isVerified = true;

            // Store real token — replace tempToken
            localStorage.setItem('token', loginRes.token);
            localStorage.setItem('user',  JSON.stringify(loginRes.user));

            // Redirect to customer dashboard after short delay
            setTimeout(() => this.router.navigate(['/customer/dashboard']), 1500);
          },
          error: (err) => {
            this.isLoading    = false;
            this.errorMessage = err.error?.message || 'Login failed after verification';
          }
        });
      },
      error: (err) => {
        this.isLoading    = false;
        this.errorMessage = err.error?.message || 'Invalid OTP. Please try again.';
        // Shake the boxes on error
        this.digits = ['', '', '', '', '', ''];
        setTimeout(() => this.otpBoxes.toArray()[0]?.nativeElement.focus(), 0);
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.tempToken}` });
  }

  private startCooldown(): void {
    this.resendCooldown = 60;
    this.timer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) clearInterval(this.timer);
    }, 1000);
  }

  get maskedPhone(): string {
    if (!this.phone) return 'your registered number';
    const p = this.phone.toString();
    return p.length >= 4 ? '••••••' + p.slice(-4) : p;
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}