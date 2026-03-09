import { Injectable }            from '@angular/core';
import { HttpClient }           from '@angular/common/http';
import { Router }               from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap }                  from 'rxjs/operators';
import { environment }          from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = environment.apiUrl;

  // ✅ KEPT — customer/profile.component.ts subscribes to this
  private _profile = new BehaviorSubject<any>(null);
  profile$ = this._profile.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Auth ──────────────────────────────────────────────────

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API}/api/auth/login`, { email, password });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API}/api/auth/register`, data);
  }


  // ── Token helpers ─────────────────────────────────────────

  setToken(token: string): void { localStorage.setItem('token', token); }
  getToken(): string | null      { return localStorage.getItem('token'); }
  clearToken(): void             { localStorage.removeItem('token'); }
saveToken(token: string): void {
    localStorage.setItem('token', token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this._profile.next({ role: payload.role, id: payload.id, email: payload.email });
    } catch { this._profile.next(null); }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch { return false; }
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try { return JSON.parse(atob(token.split('.')[1])).role; }
    catch { return ''; }
  }

  getUserId(): string {
    const token = this.getToken();
    if (!token) return '';
    try { return JSON.parse(atob(token.split('.')[1])).id; }
    catch { return ''; }
  }

  // ── Role-based redirect ───────────────────────────────────

  redirectByRole(role: string): void {
    const routes: Record<string, string> = {
      Admin:    '/admin/dashboard',
      Employee: '/delivery/dashboard',
      Customer: '/customer/shipments',
    };
    this.router.navigate([routes[role] || '/login']);
  }

  logout(): void {
    this.clearToken();
    this._profile.next(null);
    this.router.navigate(['/login']);
  }

  // ── Profile APIs ──────────────────────────────────────────

  /** Customer profile — also pushes to profile$ stream */
  getProfile(): Observable<any> {
    return this.http.get(`${this.API}/api/auth/me`).pipe(
      tap((res: any) => { if (res?.data) this._profile.next(res.data); })
    );
  }

  /** Admin profile */
  getAdminProfile(): Observable<any> {
    return this.http.get(`${this.API}/api/auth/admin/me`);
  }

  /** Employee profile */
  getEmployeeProfile(): Observable<any> {
    return this.http.get(`${this.API}/api/employee/me`);
  }

  /** Update Customer profile */
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.API}/api/auth/update-profile`, data).pipe(
      tap((res: any) => { if (res?.data) this._profile.next(res.data); })
    );
  }

  /** Update Employee profile */
  updateEmployeeProfile(data: any): Observable<any> {
    return this.http.put(`${this.API}/api/employee/me`, data);
  }

  /** Update Admin profile */
  updateAdminProfile(data: any): Observable<any> {
    return this.http.put(`${this.API}/api/admin/update-profile`, data);
  }

  /** Change password — all roles */
  changePassword(data: { current_password: string; new_password: string }): Observable<any> {
    return this.http.put(`${this.API}/api/auth/change-password`, data);
  }

  // ✅ KEPT — verify-otp.component.ts calls these
  sendOTP(): Observable<any> {
    return this.http.post(`${this.API}/api/otp/send`, {});
  }

  verifyOTP(otp: string): Observable<any> {
    return this.http.post(`${this.API}/api/otp/verify`, { otp });
  }
}