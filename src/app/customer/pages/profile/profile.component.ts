import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  isLoading = true;
  errorMessage = '';

  profile: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {

    /* ✅ Subscribe to live profile state */
    this.authService.profile$.subscribe(profile => {
      this.profile = profile;
      this.isLoading = false;
    });

    /* ✅ Initial fetch */
    this.authService.getProfile().subscribe({
      error: (err) => {
        console.warn("Profile Load Error:", err);
        this.errorMessage =
          err?.error?.message || 'Failed to load profile 💀';
        this.isLoading = false;
      }
    });
  }
}