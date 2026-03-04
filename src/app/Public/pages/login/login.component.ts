import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})


export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  };

  submitted = false;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(form: any) {

    if (this.loading) return;   // 🚫 Prevent spam clicks

    this.submitted = true;
    this.errorMessage = '';

    if (form.invalid) return;

    this.loading = true;

    this.authService.login(this.loginData).subscribe({

      next: (res: any) => {

        /* ✅ Safety Check */
        if (!res?.token || !res?.role) {
          this.errorMessage = 'Invalid server response';
          this.loading = false;
          return;
        }

        this.authService.saveToken(res.token);

        /* ✅ ADMIN FLOW 😈🔥 */
        if (res.role === 'Admin') {

          this.loading = false;   // ✅ CRITICAL FIX

          this.router.navigate(['/admin']);
          return;
        }

        /* ✅ CUSTOMER FLOW */
        this.authService.getProfile().subscribe({

          next: (profile: any) => {

            if (!profile?.data) {
              this.errorMessage = 'Profile not found';
              this.loading = false;
              return;
            }

            if (!profile.data.isNumVerified) {
              this.router.navigate(['/customer/verify-otp']);
            } else {
              this.router.navigate(['/customer']);
            }

            this.loading = false;
          },

          error: (err) => {

            console.warn("Profile Error:", err);

            this.errorMessage =
              err?.error?.message || 'Profile load failed';

            this.loading = false;
          }
        });
      },

      error: (err) => {

        console.warn("Login Error:", err);

        this.errorMessage =
          err?.error?.message || 'Invalid credentials';

        this.loading = false;
      }
    });
  }
}