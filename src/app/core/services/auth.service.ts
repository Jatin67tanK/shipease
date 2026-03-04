import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = environment.apiUrl;
  private AUTH = `${this.API}/api/auth`;

  /* ✅ PROFILE STORE */
  private profileSubject = new BehaviorSubject<any>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  /* ===================================================== */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /* ===================================================== */
  login(payload: any) {
    return this.http.post<any>(`${this.AUTH}/login`, payload);
  }

  register(payload: any) {
    return this.http.post<any>(`${this.AUTH}/register`, payload);
  }

  /* ===================================================== */
  getProfile() {
    return this.http.get<any>(
      `${this.AUTH}/me`,
      this.getAuthHeaders()
    ).pipe(
      tap((res: any) => {
        if (res?.data) {
          this.profileSubject.next(res.data);
        }
      })
    );
  }

  /* ===================================================== */
  updateProfile(payload: any) {

    /* 😈🔥 FIXED ENDPOINT */
    return this.http.put<any>(
      `${this.AUTH}/updateprofile`,   // ✅ CORRECT
      payload,
      this.getAuthHeaders()
    ).pipe(
      tap((res: any) => {

        if (res?.data) {
          this.profileSubject.next(res.data);
        } else {
          this.getProfile().subscribe();
        }
      })
    );
  }

  /* ===================================================== */
  sendOTP() {
    return this.http.post<any>(
      `${this.AUTH}/send-otp`,
      {},
      this.getAuthHeaders()
    );
  }

  verifyOTP(otp: string) {
    return this.http.post<any>(
      `${this.AUTH}/verify-otp`,
      { otp },
      this.getAuthHeaders()
    );
  }

  /* ===================================================== */
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
    this.profileSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}