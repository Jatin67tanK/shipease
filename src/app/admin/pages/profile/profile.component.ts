import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  profile: any = null;
  isLoading = true;
  isEditing = false;
  isSaving = false;
  showPasswordSection = false;

  editForm = {
    name: '',
    phone_number: '',
    state: '',
    country: ''
  };

  passwordForm = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  successMessage = '';
  errorMessage = '';
  passwordSuccess = '';
  passwordError = '';

  showCurrentPw = false;
  showNewPw = false;
  showConfirmPw = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  /* ═══════════════════════════════════════════
     LOAD PROFILE — works for both Admin & Customer
     AuthService.getProfile() should call the
     correct endpoint based on JWT role
  ═══════════════════════════════════════════ */
  loadProfile(): void {
    this.isLoading = true;

    // ── detect role from token ──
    const token = localStorage.getItem('token');
    let role = '';
    try {
      role = JSON.parse(atob(token!.split('.')[1])).role;
    } catch { }

    const request = role === 'Admin'
      ? this.authService.getAdminProfile()
      : this.authService.getProfile();

    request.subscribe({
      next: (res: any) => {
        this.profile = res?.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load profile.';
        this.isLoading = false;
      }
    });
  }

  /* ═══════════════════════════════════════════
     EDIT MODE
  ═══════════════════════════════════════════ */
  enterEditMode(): void {
    this.editForm = {
      name: this.profile?.name || '',
      phone_number: this.profile?.phone_number || '',
      state: this.profile?.state || '',
      country: this.profile?.country || ''
    };
    this.isEditing = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
  }

  /* ═══════════════════════════════════════════
     SAVE PROFILE
  ═══════════════════════════════════════════ */
  saveProfile(): void {
    const { name, phone_number, state, country } = this.editForm;

    if (!name.trim() || !phone_number.trim() || !state.trim() || !country.trim()) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.authService.updateProfile({
      name: name.trim(),
      phone_number: phone_number.trim(),
      state: state.trim(),
      country: country.trim()
    }).subscribe({
      next: (res: any) => {
        // re-fetch fresh data
        this.loadProfile();
        this.successMessage = 'Profile updated successfully!';
        this.isSaving = false;
        this.isEditing = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Update failed. Please try again.';
        this.isSaving = false;
      }
    });
  }

  /* ═══════════════════════════════════════════
     CHANGE PASSWORD
  ═══════════════════════════════════════════ */
  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  savePassword(): void {
    const { current_password, new_password, confirm_password } = this.passwordForm;

    if (!current_password || !new_password || !confirm_password) {
      this.passwordError = 'All password fields are required.';
      return;
    }

    if (new_password.length < 6) {
      this.passwordError = 'New password must be at least 6 characters.';
      return;
    }

    if (new_password !== confirm_password) {
      this.passwordError = 'New passwords do not match.';
      return;
    }

    this.isSaving = true;
    this.passwordError = '';

    this.authService.changePassword({ current_password, new_password }).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed successfully!';
        this.isSaving = false;
        this.showPasswordSection = false;
        this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
      },
      error: (err) => {
        this.passwordError = err?.error?.message || 'Password change failed.';
        this.isSaving = false;
      }
    });
  }

  /* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */
  get isAdmin(): boolean {
    return this.profile?.role === 'Admin';
  }

  get isCustomer(): boolean {
    return this.profile?.role === 'Customer';
  }

  get memberSince(): string {
    if (!this.profile?.createdAt && !this.profile?.created_at) return '—';
    const date = new Date(this.profile.createdAt || this.profile.created_at);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  get avatarInitials(): string {
    const name = this.profile?.name || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  dismissSuccess(): void { this.successMessage = ''; }
  dismissError(): void { this.errorMessage = ''; }
}