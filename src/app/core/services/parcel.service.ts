import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParcelService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // ── Customer ────────────────────────────────────────
  bookParcel(payload: any) {
    return this.http.post(`${this.API}/api/parcels/book`, payload);
  }

  getPriceSummary(payload: any) {
    return this.http.post(`${this.API}/api/parcels/price-summary`, payload);
  }

  finalBooking(parcelId: string) {
    return this.http.put(`${this.API}/api/parcels/final-booking/${parcelId}`, {});
  }

  getParcels(type: string) {
    return this.http.get(`${this.API}/api/parcels/list?type=${type}`);
  }

  trackParcel(trackingId: string) {
    return this.http.get(`${this.API}/api/parcels/${trackingId}`);
  }

  getParcelEvents(trackingId: string) {
    return this.http.get(`${this.API}/api/parcels/${trackingId}/events`);
  }

  // ── Admin ────────────────────────────────────────────
  updateStatus(trackingId: string, status: string) {
    return this.http.put(`${this.API}/api/parcels/${trackingId}/status`, { status });
  }

  getAdminStats() {
    return this.http.get(`${this.API}/api/parcels/admin-stats`);
  }

  getPricing() {
    return this.http.get<any>(`${this.API}/api/pricing`, this.getHeaders());
  }

  updatePricing(payload: any) {
    return this.http.put<any>(`${this.API}/api/pricing/update`, payload, this.getHeaders());
  }

  downloadInvoice(trackingId: string): Observable<Blob> {
    return this.http.get(`${this.API}/api/parcels/invoice/${trackingId}`, { responseType: 'blob' });
  }

  downloadExcel(filters: any): Observable<Blob> {
    return this.http.post(`${this.API}/api/parcels/download-excel`, filters, { responseType: 'blob' });
  }

  downloadPDF(filters: any): Observable<Blob> {
    return this.http.post(`${this.API}/api/parcels/download-pdf`, filters, { responseType: 'blob' });
  }

  // ── Employee ─────────────────────────────────────────
  getAssignedParcels(status?: string) {
    const q = status ? `?status=${status}` : '';
    return this.http.get(`${this.API}/api/employee/my-parcels${q}`);
  }

  updateDeliveryStatus(trackingId: string, status: string, note?: string) {
    return this.http.put(`${this.API}/api/employee/${trackingId}/status`, { status, note });
  }

  getEmployeeStats() {
    return this.http.get(`${this.API}/api/employee/stats`);
  }

  // ── Admin → Employee Management ──────────────────────
  getAllEmployees() {
    return this.http.get(`${this.API}/api/employee/all`);
  }

  registerEmployee(payload: any) {
    return this.http.post(`${this.API}/api/employee/register`, payload);
  }

  assignParcel(tracking_id: string, employee_id: string) {
    return this.http.post(`${this.API}/api/employee/assign`, { tracking_id, employee_id });
  }
}
