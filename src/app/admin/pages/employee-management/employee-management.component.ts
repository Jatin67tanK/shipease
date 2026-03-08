import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html'
})
export class EmployeeManagementComponent implements OnInit {

  employees: any[] = [];
  isLoading = true;

  // Add employee form
  showAddModal = false;
  isAdding = false;
  addForm = { name: '', email: '', password: '', phone_number: '', state: '', country: 'India' };
  addError = '';

  // Assign parcel form
  showAssignModal = false;
  isAssigning = false;
  selectedEmployeeId = '';
  assignTrackingId = '';
  assignError = '';

  constructor(private parcelService: ParcelService) {}

  ngOnInit(): void { this.loadEmployees(); }

  loadEmployees(): void {
    this.isLoading = true;
    this.parcelService.getAllEmployees().subscribe({
      next: (res: any) => { this.employees = res.data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  // ── Add Employee ─────────────────────────────────────
  openAddModal(): void {
    this.addForm = { name: '', email: '', password: '', phone_number: '', state: '', country: 'India' };
    this.addError = '';
    this.showAddModal = true;
  }

  submitAddEmployee(): void {
    const { name, email, password, phone_number, state } = this.addForm;
    if (!name || !email || !password || !phone_number || !state) {
      this.addError = 'All fields are required';
      return;
    }
    this.isAdding = true;
    this.addError = '';

    this.parcelService.registerEmployee(this.addForm).subscribe({
      next: () => {
        this.showAddModal = false;
        this.isAdding = false;
        this.loadEmployees();
      },
      error: (err) => {
        this.addError = err?.error?.message || 'Registration failed';
        this.isAdding = false;
      }
    });
  }

  // ── Assign Parcel ─────────────────────────────────────
  openAssignModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId;
    this.assignTrackingId = '';
    this.assignError = '';
    this.showAssignModal = true;
  }

  submitAssign(): void {
    if (!this.assignTrackingId.trim()) {
      this.assignError = 'Tracking ID is required';
      return;
    }
    this.isAssigning = true;
    this.assignError = '';

    this.parcelService.assignParcel(this.assignTrackingId.trim(), this.selectedEmployeeId).subscribe({
      next: () => {
        this.showAssignModal = false;
        this.isAssigning = false;
        this.loadEmployees();
      },
      error: (err) => {
        this.assignError = err?.error?.message || 'Assignment failed';
        this.isAssigning = false;
      }
    });
  }
}
