import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-unassigned-parcels',
  templateUrl: './unassigned-parcels.component.html'
})
export class UnassignedParcelsComponent implements OnInit {

  parcels:   any[] = [];
  employees: any[] = [];
  isLoading  = true;

  // Manual assign
  selectedParcelId  = '';
  selectedEmployeeId = '';
  isAssigning       = false;
  showAssignModal   = false;
  assigningParcel: any = null;

  successMsg = '';
  errorMsg   = '';

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.http.get<any>(`${this.API}/api/admin/parcels/unassigned`).subscribe({
      next: (r) => { this.parcels = r.data; this.isLoading = false; }
    });
    this.http.get<any>(`${this.API}/api/employee/all`).subscribe({
      next: (r) => { this.employees = r.data; }
    });
  }

  openAssignModal(parcel: any): void {
    this.assigningParcel   = parcel;
    this.selectedParcelId  = parcel._id;
    this.selectedEmployeeId = '';
    this.showAssignModal   = true;
    this.errorMsg = '';
  }

  closeModal(): void { this.showAssignModal = false; this.assigningParcel = null; }

  confirmAssign(): void {
    if (!this.selectedEmployeeId) { this.errorMsg = 'Please select an employee'; return; }
    this.isAssigning = true;

    this.http.post<any>(`${this.API}/api/admin/parcels/manual-assign`, {
      parcelId:   this.selectedParcelId,
      employeeId: this.selectedEmployeeId,
    }).subscribe({
      next: (r) => {
        this.successMsg  = r.message;
        this.isAssigning = false;
        this.closeModal();
        this.loadData();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.errorMsg   = err?.error?.error || 'Assignment failed';
        this.isAssigning = false;
      }
    });
  }
}
