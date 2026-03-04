import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParcelService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* ✅ AUTH HEADER */
  private getHeaders() {

    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /* =====================================================
     🚀 BOOK PARCEL
  ===================================================== */
  bookParcel(payload: any) {
    return this.http.post(`${this.API}/api/parcels/book`, payload);
  }

  /* =====================================================
     🚀 PRICE SUMMARY
  ===================================================== */
  getPriceSummary(payload: any) {
    return this.http.post(`${this.API}/api/parcels/price-summary`, payload);
  }

  

  /* =====================================================
     🚀 FINAL BOOKING / PAYMENT
  ===================================================== */
  finalBooking(parcelId: string) {
    return this.http.put(
      `${this.API}/api/parcels/final-booking/${parcelId}`,
      {}
    );
  }

  /* =====================================================
     🚀 PARCEL LIST
  ===================================================== */
getParcels(type: string) {
  return this.http.get(`${this.API}/api/parcels/list?type=${type}`);
}

  /* =====================================================
     🚀 TRACK PARCEL
  ===================================================== */
  trackParcel(trackingId: string) {
    return this.http.get(`${this.API}/api/parcels/${trackingId}`);
  }

  /* =====================================================
     😈🔥 TRACKING EVENTS
  ===================================================== */
  getParcelEvents(trackingId: string) {
    return this.http.get(`${this.API}/api/parcels/${trackingId}/events`);
  }

  /* =====================================================
     😈🔥 ADMIN STATUS UPDATE
  ===================================================== */
  updateStatus(trackingId: string, status: string) {
    return this.http.put(
      `${this.API}/api/parcels/${trackingId}/status`,
      { status }
    );
  }

  /* =====================================================
     😎 ADMIN DASHBOARD STATS
  ===================================================== */
  getAdminStats() {
    return this.http.get(`${this.API}/api/parcels/admin-stats`);
  }

  /* =====================================================
     💰 GET PRICING
  ===================================================== */
  getPricing() {
    return this.http.get<any>(
      `${this.API}/api/pricing`,
      this.getHeaders()
    );
  }

  /* =====================================================
     ✅ UPDATE PRICING 😈🔥 FIXED
  ===================================================== */
  updatePricing(payload: any) {
    return this.http.put<any>(   // ✅ PUT is correct
      `${this.API}/api/pricing/update`,   // ✅ THIS WAS THE BUG
      payload,
      this.getHeaders()
    );
  }

  // ── 1. Download Invoice PDF for a single parcel ───────────────────────────────
downloadInvoice(trackingId: string): Observable<Blob> {
  return this.http.get(
    `${environment.apiUrl}/api/parcels/invoice/${trackingId}`,
    { responseType: 'blob' }
  );
}

// ── 2. Download filtered data as Excel ───────────────────────────────────────
downloadExcel(filters: any): Observable<Blob> {
  return this.http.post(
    `${environment.apiUrl}/api/parcels/download-excel`,
    filters,
    { responseType: 'blob' }
  );
}

// ── 3. Download filtered data as PDF ─────────────────────────────────────────
downloadPDF(filters: any): Observable<Blob> {
  return this.http.post(
    `${environment.apiUrl}/api/parcels/download-pdf`,
    filters,
    { responseType: 'blob' }
  );
}

}

