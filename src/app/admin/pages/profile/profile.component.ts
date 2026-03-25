import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  profile: any = null;
  isLoading  = true;
  isEditing  = false;
  isSaving   = false;
  showPasswordSection = false;

  editForm = { name: '', phone_number: '', state: '', country: '' };
  passwordForm = { current_password: '', new_password: '', confirm_password: '' };

  successMessage = '';
  errorMessage   = '';
  passwordSuccess = '';
  passwordError   = '';

  showCurrentPw = false;
  showNewPw     = false;
  showConfirmPw = false;

  // ── Phone Verification Modal ──────────────────────────
  showPhoneModal     = false;
  phoneOtpDigits     = ['', '', '', '', '', ''];
  phoneOtpSending    = false;
  phoneOtpVerifying  = false;
  phoneOtpError      = '';
  phoneOtpSuccess    = '';
  phoneResendCooldown = 0;
  private phoneTimer: any;

  // ── Email Verification Modal ──────────────────────────
  showEmailModal     = false;
  emailToVerify      = '';
  emailCodeDigits    = ['', '', '', '', '', ''];
  emailCodeSending   = false;
  emailCodeVerifying = false;
  emailCodeError     = '';
  emailCodeSuccess   = '';
  emailResendCooldown = 0;
  emailCodeSent      = false;
  private emailTimer: any;

  private API = environment.apiUrl;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void { this.loadProfile(); }

  // ── LOAD PROFILE ──────────────────────────────────────
  loadProfile(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    let role = '';
    try { role = JSON.parse(atob(token!.split('.')[1])).role; } catch {}

    const req = role === 'Admin'
      ? this.authService.getAdminProfile()
      : role === 'Employee'
        ? this.authService.getEmployeeProfile()
        : this.authService.getProfile();

    req.subscribe({
      next: (res: any) => { this.profile = res?.data; this.isLoading = false; },
      error: (err: any) => { this.errorMessage = err?.error?.message || 
        'Failed to load profile.'; this.isLoading = false; }
    });
  }

  // ── EDIT MODE ─────────────────────────────────────────
  enterEditMode(): void {
    this.editForm = {
      name:         this.profile?.name         || '',
      phone_number: this.profile?.phone_number || '',
      state:        this.profile?.state        || '',
      country:      this.profile?.country      || ''
    };
    this.isEditing = true;
    this.successMessage = '';
    this.errorMessage   = '';
  }

  cancelEdit(): void { this.isEditing = false; this.errorMessage = ''; }

  saveProfile(): void {
    const { name, phone_number, state, country } = this.editForm;
    if (!name.trim() || !phone_number.trim() || !state.trim() || !country.trim()) {
      this.errorMessage = 'All fields are required.'; return;
    }
    const phoneChanged = phone_number.trim() !== (this.profile?.phone_number || '');
    this.isSaving = true;
    this.errorMessage = '';
const token = localStorage.getItem('token');
    let role = '';
    try { 
        role = JSON.parse(atob(token!.split('.')[1])).role; 
    } catch {}

    // 1. Declare the variable without assigning it yet
    let req;

    // 2. Assign the correct Observable based on the role
    if (role === 'Employee') {
        req = this.authService.updateEmployeeProfile({ 
            name: name.trim(), 
            phone_number: phone_number.trim(), 
            state: state.trim(), 
            country: country.trim() 
        });
    } else if (role === 'Admin') {
        req = this.authService.updateAdminProfile({ 
            name: name.trim(), 
            phone_number: phone_number.trim(), 
            state: state.trim(), 
            country: country.trim() 
        });
    } else {
        req = this.authService.updateProfile({ 
            name: name.trim(), 
            phone_number: phone_number.trim(), 
            state: state.trim(), 
            country: country.trim() 
        });
    }

    // 3. Now 'req' holds the correct reference for the subscription
    req.subscribe({
        next: () => {
            this.loadProfile();
            this.successMessage = phoneChanged
                ? 'Profile saved! Phone number changed — please verify your new number.'
                : 'Profile updated successfully!';
            this.isSaving = false;
            this.isEditing = false;
        },
        error: (err: any) => { 
            this.errorMessage = err?.error?.message || 'Update failed.'; 
            this.isSaving = false; 
        }
    });
  }

  // ── CHANGE PASSWORD ───────────────────────────────────
  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    this.passwordForm    = { current_password: '', new_password: '', confirm_password: '' };
    this.passwordError   = '';
    this.passwordSuccess = '';
  }

  savePassword(): void {
    const { current_password, new_password, confirm_password } = this.passwordForm;
    if (!current_password || !new_password || !confirm_password) {
       this.passwordError = 'All fields required.'; return; }
    if (new_password.length < 6) { this.passwordError = 'Min 6 characters.'; return; }
    if (new_password !== confirm_password) { this.passwordError = 'Passwords do not match.'; return; }
    this.isSaving = true;
    this.passwordError = '';

    this.authService.changePassword({ current_password, new_password }).subscribe({
      next: () => {
        this.passwordSuccess = 'Password changed!';
        this.isSaving = false;
        this.showPasswordSection = false;
        this.passwordForm = { current_password: '', new_password: '', confirm_password: '' };
      },
      error: (err: any) => { this.passwordError = err?.error?.message || 'Failed.'; this.isSaving = false; }
    });
  }

  // ════════════════════════════════════════════════════════
  //  PHONE VERIFICATION MODAL
  // ════════════════════════════════════════════════════════

  openPhoneModal(): void {
    this.showPhoneModal      = true;
    this.phoneOtpDigits      = ['', '', '', '', '', ''];
    this.phoneOtpError       = '';
    this.phoneOtpSuccess     = '';
    this.phoneResendCooldown = 0;
    this.sendPhoneOTP();
  }

  closePhoneModal(): void {
    this.showPhoneModal = false;
    clearInterval(this.phoneTimer);
  }

  sendPhoneOTP(): void {
    if (this.phoneResendCooldown > 0) return;
    this.phoneOtpSending = true;
    this.phoneOtpError   = '';

    this.http.post<any>(`${this.API}/api/otp/phone/send`, {}, { headers: this.authHeaders() })
      .subscribe({
        next: () => { this.phoneOtpSending = false; this.startPhoneCooldown(); },
        error: (err: any) =>
           { this.phoneOtpSending = false; this.phoneOtpError = err.error?.message || 'Failed to send OTP'; }
      });
  }

  resendPhoneOTP(): void {
    this.phoneOtpSending = true;
    this.phoneOtpError   = '';
    this.http.post<any>(`${this.API}/api/otp/phone/resend`, {}, { headers: this.authHeaders() })
      .subscribe({
        next: () => { this.phoneOtpSending = false;
           this.phoneOtpDigits = ['', '', '', '', '', '']; this.startPhoneCooldown(); },
        error: (err: any) =>
           { this.phoneOtpSending = false; this.phoneOtpError = err.error?.message || 'Failed'; }
      });
  }

  verifyPhoneOTP(): void {
    const otp = this.phoneOtpDigits.join('');
    if (otp.length !== 6) { this.phoneOtpError = 'Enter all 6 digits'; return; }
    this.phoneOtpVerifying = true;
    this.phoneOtpError     = '';

    this.http.post<any>(`${this.API}/api/otp/phone/verify`, { otp }, { headers: this.authHeaders() })
      .subscribe({
        next: () => {
          this.phoneOtpSuccess   = 'Phone verified successfully!';
          this.phoneOtpVerifying = false;
          this.profile.isNumVerified = true;
          setTimeout(() => this.closePhoneModal(), 1500);
        },
        error: (err: any) => {
          this.phoneOtpError     = err.error?.message || 'Invalid OTP';
          this.phoneOtpVerifying = false;
          this.phoneOtpDigits    = ['', '', '', '', '', ''];
        }
      });
  }

  // Single input handler for phone OTP
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const val   = input.value.replace(/\D/g, '').slice(0, 6);
    input.value = val;
    this.phoneOtpDigits = val.split('').concat(Array(6 - val.length).fill(''));
    this.phoneOtpError  = '';
    if (val.length === 6) setTimeout(() => this.verifyPhoneOTP(), 100);
  }

  private startPhoneCooldown(): void {
    this.phoneResendCooldown = 60;
    this.phoneTimer = setInterval(() => {
      this.phoneResendCooldown--;
      if (this.phoneResendCooldown <= 0) clearInterval(this.phoneTimer);
    }, 1000);
  }

  // ════════════════════════════════════════════════════════
  //  EMAIL VERIFICATION MODAL
  // ════════════════════════════════════════════════════════

  openEmailModal(): void {
    this.showEmailModal      = true;
    this.emailToVerify       = this.profile?.email || '';
    this.emailCodeDigits     = ['', '', '', '', '', ''];
    this.emailCodeError      = '';
    this.emailCodeSuccess    = '';
    this.emailCodeSent       = false;
    this.emailResendCooldown = 0;
  }

  closeEmailModal(): void {
    this.showEmailModal = false;
    clearInterval(this.emailTimer);
  }

  sendEmailCode(): void {
    if (!this.emailToVerify || !this.emailToVerify.includes('@')) {
      this.emailCodeError = 'Enter a valid email address'; return;
    }
    this.emailCodeSending = true;
    this.emailCodeError   = '';

    this.http.post<any>(`${this.API}/api/otp/email/send`, { email: this.emailToVerify }, { headers: this.authHeaders() })
      .subscribe({
        next: () => { this.emailCodeSending = false; this.emailCodeSent = true; this.startEmailCooldown(); },
        error: (err: any) => { this.emailCodeSending = false; this.emailCodeError = err.error?.message || 'Failed to send code'; }
      });
  }

  resendEmailCode(): void {
    this.emailCodeSending = true;
    this.emailCodeError   = '';
    this.http.post<any>(`${this.API}/api/otp/email/resend`, {}, { headers: this.authHeaders() })
      .subscribe({
        next: () => { this.emailCodeSending = false; this.emailCodeDigits = ['', '', '', '', '', '']; this.startEmailCooldown(); },
        error: (err: any) => { this.emailCodeSending = false; this.emailCodeError = err.error?.message || 'Failed'; }
      });
  }

  verifyEmailCode(): void {
    const code = this.emailCodeDigits.join('');
    if (code.length !== 6) { this.emailCodeError = 'Enter all 6 digits'; return; }
    this.emailCodeVerifying = true;
    this.emailCodeError     = '';

    this.http.post<any>(`${this.API}/api/otp/email/verify`, { code }, { headers: this.authHeaders() })
      .subscribe({
        next: (res: any) => {
          this.emailCodeSuccess   = 'Email verified!';
          this.emailCodeVerifying = false;
          this.profile.isEmailVerified = true;
          if (res.email) this.profile.email = res.email;
          setTimeout(() => this.closeEmailModal(), 1500);
        },
        error: (err: any) => {
          this.emailCodeError     = err.error?.message || 'Invalid code';
          this.emailCodeVerifying = false;
          this.emailCodeDigits    = ['', '', '', '', '', ''];
        }
      });
  }

  // Single input handler for email code
  onEmailInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const val   = input.value.replace(/\D/g, '').slice(0, 6);
    input.value = val;
    this.emailCodeDigits = val.split('').concat(Array(6 - val.length).fill(''));
    this.emailCodeError  = '';
    if (val.length === 6) setTimeout(() => this.verifyEmailCode(), 100);
  }

  private startEmailCooldown(): void {
    this.emailResendCooldown = 60;
    this.emailTimer = setInterval(() => {
      this.emailResendCooldown--;
      if (this.emailResendCooldown <= 0) clearInterval(this.emailTimer);
    }, 1000);
  }

  // ── HELPERS ───────────────────────────────────────────
  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  get isAdmin(): boolean    { return this.profile?.role === 'Admin'; }
  get isCustomer(): boolean { return this.profile?.role === 'Customer'; }

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
  dismissError(): void   { this.errorMessage = ''; }
}