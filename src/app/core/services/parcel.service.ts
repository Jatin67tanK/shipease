import { Injectable }   from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { Observable }  from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ParcelService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Customer ──────────────────────────────────────────────

// parcel.service.ts
bookParcel(data: any): Observable<any> {
  return this.http.post(`${this.API}/api/parcels/book`, data);
}

  getMyParcels(): Observable<any> {
    return this.http.get(`${this.API}/api/parcels/my-parcels`);
  }

  // ✅ KEPT — existing components call getParcels('active') / getParcels('non-active')
getParcels(type: string): Observable<any> {
  return this.http.get(`${this.API}/api/parcels/list?type=${type}`);
}

  // ✅ KEPT — checkout.component.ts calls this
  getPricing(): Observable<any> {
    return this.http.get(`${this.API}/api/pricing`);
  }

  // ── Admin Pricing Management ───────────────────────────
updatePricing(payload: any): Observable<any> {
  return this.http.put(`${this.API}/api/pricing/update`, payload);
}

  // ✅ KEPT — checkout.component.ts calls this
 finalBooking(bookingId: string): Observable<any> {
  return this.http.put(`${this.API}/api/parcels/final-booking/${bookingId}`, {});
}

  trackParcel(trackingId: string): Observable<any> {
  return this.http.get(`${this.API}/api/parcels/${trackingId}`);
}

  getParcelById(id: string): Observable<any> {
    return this.http.get(`${this.API}/api/parcels/${id}`);
  }

  getParcelEvents(trackingId: string): Observable<any> {
  return this.http.get(`${this.API}/api/parcels/${trackingId}/events`);
}

  // ── Admin ─────────────────────────────────────────────────

  getAllParcels(params?: any): Observable<any> {
    return this.http.get(`${this.API}/api/parcels/all`, { params });
  }

  updateParcelStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.API}/api/parcels/${id}/status`, { status });
  }

  deleteParcel(id: string): Observable<any> {
    return this.http.delete(`${this.API}/api/parcels/${id}`);
  }

  // ── Admin Dashboard Stats ───────────────────────────────
getAdminStats(): Observable<any> {
  return this.http.get(`${this.API}/api/admin/dashboard-summary`);
}

  // ── Employee Management (Admin) ───────────────────────────

  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.API}/api/employee/all`);
  }

  registerEmployee(data: any): Observable<any> {
    return this.http.post(`${this.API}/api/employee/register`, data);
  }

  assignParcel(tracking_id: string, employee_id: string): Observable<any> {
    return this.http.post(`${this.API}/api/employee/assign`, { tracking_id, employee_id });
  }

  updateEmployeeCities(id: string, cities: string[]): Observable<any> {
    return this.http.patch(`${this.API}/api/employee/${id}/cities`, { assignedCities: cities });
  }

  // ── Employee (own) ────────────────────────────────────────

  // ✅ FIX — status param typed strictly so HttpParams accepts it
  getAssignedParcels(status?: string): Observable<any> {
    const params: { [key: string]: string } = {};
    if (status) params['status'] = status;
    return this.http.get(`${this.API}/api/employee/parcels`, { params });
  }

  updateDeliveryStatus(parcelId: string, status: string): Observable<any> {
    return this.http.patch(`${this.API}/api/employee/parcels/${parcelId}/status`, { status });
  }

  getEmployeeStats(): Observable<any> {
    return this.http.get(`${this.API}/api/employee/stats`);
  }

  downloadEmployeePDF(): Observable<Blob> {
    return this.http.get(`${this.API}/api/employee/parcels/download-pdf`, { responseType: 'blob' });
  }

  // ── ParcelService ─────────────────────────────
downloadInvoice(trackingId: string): Observable<Blob> {
  return this.http.get(`${this.API}/api/parcels/invoice/${trackingId}`, { responseType: 'blob' });
}

// Download Excel for filtered parcels
downloadExcel(filters?: any): Observable<Blob> {
  return this.http.post(`${this.API}/api/parcels/download-excel`, filters || {}, { responseType: 'blob' });
}

// Download PDF for filtered parcels
downloadPDF(filters?: any): Observable<Blob> {
  return this.http.post(`${this.API}/api/admin/parcels/download-pdf`, filters || {}, { responseType: 'blob' });
}

  // ── Admin Cycle ───────────────────────────────────────────

  runCycle(): Observable<any> {
    return this.http.post(`${this.API}/api/admin/run-cycle`, {});
  }

  getCycles(page = 1): Observable<any> {
    return this.http.get(`${this.API}/api/admin/cycles?page=${page}`);
  }

  getCycleById(id: string): Observable<any> {
    return this.http.get(`${this.API}/api/admin/cycles/${id}`);
  }

  getEmployeeProgress(): Observable<any> {
    return this.http.get(`${this.API}/api/admin/employees/progress`);
  }

  getEmployeeParcels(id: string): Observable<any> {
    return this.http.get(`${this.API}/api/admin/employees/${id}/parcels`);
  }

  reassignParcels(parcelIds: string[], toEmployeeId: string): Observable<any> {
    return this.http.post(`${this.API}/api/admin/parcels/reassign`, { parcelIds, toEmployeeId });
  }

  toggleEmployeeAvailability(id: string): Observable<any> {
    return this.http.patch(`${this.API}/api/admin/employees/${id}/toggle-availability`, {});
  }

  getUnassignedParcels(): Observable<any> {
    return this.http.get(`${this.API}/api/admin/parcels/unassigned`);
  }

  manualAssign(parcelId: string, employeeId: string): Observable<any> {
    return this.http.post(`${this.API}/api/admin/parcels/manual-assign`, { parcelId, employeeId });
  }

  // ── Stats/Charts ──────────────────────────────────────────

  statsMonthlyBookings(month: number, year: number): Observable<any> {
    return this.http.get(`${this.API}/api/admin/stats/monthly-bookings?month=${month}&year=${year}`);
  }

  statsCityDistribution(from: string, to: string): Observable<any> {
    return this.http.get(`${this.API}/api/admin/stats/city-distribution?from=${from}&to=${to}`);
  }

  statsStatusBreakdown(from: string, to: string): Observable<any> {
    return this.http.get(`${this.API}/api/admin/stats/status-breakdown?from=${from}&to=${to}`);
  }

  statsEmployeePerformance(month: number, year: number): Observable<any> {
    return this.http.get(`${this.API}/api/admin/stats/employee-performance?month=${month}&year=${year}`);
  }

  statsSuccessRate(): Observable<any> {
    return this.http.get(`${this.API}/api/admin/stats/success-rate-trend`);
  }
}