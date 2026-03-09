import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  form = { email: '', password: '' };
  isLoading = false;
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
