import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit {

  profile: any = null;

  isLoading = true;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {

    this.isLoading = true;

    this.authService.getProfile().subscribe({

      next: (res: any) => {

        if (!res?.data) {
          this.errorMessage = 'Profile not found 💀';
          this.isLoading = false;
          return;
        }

        this.profile = { ...res.data };   // ✅ Deep copy
        this.isLoading = false;
      },

      error: (err) => {

        console.warn("Profile Load Error:", err);

        this.errorMessage =
          err?.error?.message || 'Failed to load profile 💀';

        this.isLoading = false;
      }
    });
  }

  saveChanges(): void {

    if (!this.profile) {
      this.errorMessage = "Profile not loaded 💀";
      return;
    }

    const payload = {
      name: this.profile.name?.trim(),
      phone_number: this.profile.phone_number?.trim(),
      state: this.profile.state?.trim(),
      country: this.profile.country?.trim()
    };

    console.log("😈 PAYLOAD:", payload);

    if (!payload.name ||
        !payload.phone_number ||
        !payload.state ||
        !payload.country) {

      this.errorMessage = "Fill required fields 😑";
      return;
    }

    this.isSaving = true;

    this.authService.updateProfile(payload).subscribe({

      next: (res) => {

        console.log("😈 RESPONSE:", res);

        this.successMessage = "Profile Updated 😎🔥";
        this.isSaving = false;

        this.router.navigate(['/customer/profile']);
      },

      error: (err) => {

        console.warn("Update Error:", err);

        this.errorMessage =
          err?.error?.message || "Update failed 💀";

        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/customer/profile']);
  }
}