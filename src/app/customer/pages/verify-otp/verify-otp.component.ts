import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent {

  otp: string = '';
  errorMessage = '';
  successMessage = '';
  loading = false;
  otpLoading = false;   // 😈🔥 Separate loader for Send OTP

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /* =====================================================
     ✅ SEND OTP 😈🔥
  ===================================================== */

  sendOTP() {

  if (this.loading) return;   // 😈🔥 BLOCK DOUBLE CLICK

  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.authService.sendOTP().subscribe({

    next: (res: any) => {
      this.successMessage = res.message;
      this.loading = false;
    },

    error: (err) => {
      this.errorMessage = err?.error?.message || 'Failed to send OTP';
      this.loading = false;
    }
  });
}

  /* =====================================================
     ✅ VERIFY OTP 😈🔥
  ===================================================== */

  verifyOTP() {

    if (this.loading) return;      // 🚫 Prevent spam clicks

    const cleanOTP = this.otp.trim();

    if (!cleanOTP) {
      this.errorMessage = 'Please enter OTP';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.verifyOTP(cleanOTP).subscribe({

      next: () => {

        /* ✅ Refresh profile AFTER verification */
        this.authService.getProfile().subscribe({

          next: (profile: any) => {

            if (profile?.data) {
              localStorage.setItem(
                'profile',
                JSON.stringify(profile.data)
              );
            }

            this.loading = false;

            /* ✅ Navigation safe */
            this.router.navigate(['/customer']);
          },

          error: () => {

            /* Even if profile fails → don't block user */
            this.loading = false;
            this.router.navigate(['/customer']);
          }
        });
      },

      error: (err) => {

        this.loading = false;

        this.errorMessage =
          err?.error?.message ||
          'Invalid OTP 💀';
      }
    });
  }
}