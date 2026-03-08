import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = environment.apiUrl;
  private AUTH = `${this.API}/api/auth`;

  private profileSubject = new BehaviorSubject<any>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  login(payload: any) {
    return this.http.post<any>(`${this.AUTH}/login`, payload);
  }

  register(payload: any) {
    return this.http.post<any>(`${this.AUTH}/register`, payload);
  }

  // ── Role-based redirect after login ──────────────────
  redirectByRole(role: string): void {
    if (role === 'Admin') this.router.navigate(['/admin/dashboard']);
    else if (role === 'Employee') this.router.navigate(['/delivery/dashboard']);
    else this.router.navigate(['/customer/shipments']);
  }

  // ── Profiles ─────────────────────────────────────────
  getProfile() {
    return this.http.get<any>(`${this.AUTH}/me`, this.getAuthHeaders()).pipe(
      tap((res: any) => { if (res?.data) this.profileSubject.next(res.data); })
    );
  }

  getAdminProfile() {
    return this.http.get<any>(`${this.AUTH}/admin/me`, this.getAuthHeaders()).pipe(
      tap((res: any) => { if (res?.data) this.profileSubject.next(res.data); })
    );
  }

  getEmployeeProfile() {
    return this.http.get<any>(`${this.API}/api/employee/me`, this.getAuthHeaders()).pipe(
      tap((res: any) => { if (res?.data) this.profileSubject.next(res.data); })
    );
  }

  updateProfile(payload: any) {
    return this.http.put<any>(`${this.AUTH}/updateprofile`, payload, this.getAuthHeaders()).pipe(
      tap((res: any) => { if (res?.data) this.profileSubject.next(res.data); })
    );
  }

  updateEmployeeProfile(payload: any) {
    return this.http.put<any>(`${this.API}/api/employee/me`, payload, this.getAuthHeaders());
  }

  sendOTP() {
    return this.http.post<any>(`${this.AUTH}/send-otp`, {}, this.getAuthHeaders());
  }

  verifyOTP(otp: string) {
    return this.http.post<any>(`${this.AUTH}/verify-otp`, { otp }, this.getAuthHeaders());
  }

  saveToken(token: string) { localStorage.setItem('token', token); }
  getToken() { return localStorage.getItem('token'); }

  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      return JSON.parse(atob(token.split('.')[1]))?.role || '';
    } catch { return ''; }
  }

  clearToken() {
    localStorage.removeItem('token');
    this.profileSubject.next(null);
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean { return !!this.getToken(); }
  // ADD THIS METHOD to auth.service.ts

changePassword(payload: { current_password: string; new_password: string }) {
  return this.http.put<any>(
    `${this.AUTH}/change-password`,
    payload,
    this.getAuthHeaders()
  );
}
}
