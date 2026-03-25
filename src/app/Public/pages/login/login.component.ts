import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ⬅️ Add this
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
   // For ngModel

@Component({
  selector: 'app-login',
  standalone: true,           // ⬅️ This must be true
  imports: [CommonModule, FormsModule], // ⬅️ Add these two here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form = { email: '', password: '' };
  isLoading    = false;
  errorMessage = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errorMessage = '';

    if (!this.form.email || !this.form.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.form.email, this.form.password).subscribe({
      next: (res: any) => {

        // ── Phone verification required (unverified customer) ──
        if (res.requiresVerification) {
          this.authService.setTempToken(res.tempToken); // store in sessionStorage
          this.isLoading = false;
          this.router.navigate(['/verify-otp'], {
            state: { phone: res.phone }
          });
          return;
        }

        // ── Normal login ──────────────────────────────────────
        this.authService.saveToken(res.token);
        this.authService.redirectByRole(res.role);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Invalid credentials. Please try again.';
        this.isLoading = false;
      }
    });
  }
}