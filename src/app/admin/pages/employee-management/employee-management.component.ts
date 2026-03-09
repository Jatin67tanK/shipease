import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html'
})
export class EmployeeManagementComponent implements OnInit {

  employees: any[] = [];
  isLoading = true;

  // ── Add Employee ──────────────────────────────────────
  showAddModal = false;
  isAdding     = false;
  addError     = '';
  addForm = {
    name:         '',
    email:        '',
    password:     '',
    phone_number: '',
    state:        '',
    country:      'India',
    assignedCities: [] as string[]
  };
  cityInput = '';   // temp input for adding a city tag

  // ── Assign Parcel ─────────────────────────────────────
  showAssignModal    = false;
  isAssigning        = false;
  selectedEmployeeId = '';
  assignTrackingId   = '';
  assignError        = '';

  // ── Manage Cities Modal ───────────────────────────────
  showCitiesModal    = false;
  citiesEmployee: any = null;
  citiesList: string[] = [];
  cityCityInput      = '';
  isSavingCities     = false;
  citiesError        = '';

  // India states list
  readonly stateList = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
    'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
    'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Delhi','Jammu & Kashmir','Ladakh','Puducherry'
  ];

  constructor(private parcelService: ParcelService) {}

  ngOnInit(): void { this.loadEmployees(); }

  loadEmployees(): void {
    this.isLoading = true;
    this.parcelService.getAllEmployees().subscribe({
      next: (res: any) => { this.employees = res.data || []; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  // ── Add Employee ──────────────────────────────────────

  openAddModal(): void {
    this.addForm  = { name: '', email: '', password: '', phone_number: '', state: '', country: 'India', assignedCities: [] };
    this.cityInput = '';
    this.addError  = '';
    this.showAddModal = true;
  }

  addCityTag(): void {
    const c = this.cityInput.trim();
    if (c && !this.addForm.assignedCities.includes(c)) {
      this.addForm.assignedCities.push(c);
    }
    this.cityInput = '';
  }

  addCityOnEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') { event.preventDefault(); this.addCityTag(); }
  }

  removeAddCity(i: number): void { this.addForm.assignedCities.splice(i, 1); }

  submitAddEmployee(): void {
    const { name, email, password, phone_number, state } = this.addForm;
    if (!name || !email || !password || !phone_number || !state) {
      this.addError = 'All required fields must be filled'; return;
    }
    this.isAdding = true; this.addError = '';
    this.parcelService.registerEmployee(this.addForm).subscribe({
      next: () => { this.showAddModal = false; this.isAdding = false; this.loadEmployees(); },
      error: (err) => { this.addError = err?.error?.message || 'Registration failed'; this.isAdding = false; }
    });
  }

  // ── Assign Parcel ─────────────────────────────────────

  openAssignModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId;
    this.assignTrackingId   = '';
    this.assignError        = '';
    this.showAssignModal    = true;
  }

  submitAssign(): void {
    if (!this.assignTrackingId.trim()) { this.assignError = 'Tracking ID is required'; return; }
    this.isAssigning = true; this.assignError = '';
    this.parcelService.assignParcel(this.assignTrackingId.trim(), this.selectedEmployeeId).subscribe({
      next: () => { this.showAssignModal = false; this.isAssigning = false; this.loadEmployees(); },
      error: (err) => { this.assignError = err?.error?.message || 'Assignment failed'; this.isAssigning = false; }
    });
  }

  // ── Manage Cities ─────────────────────────────────────

  openCitiesModal(emp: any): void {
    this.citiesEmployee  = emp;
    this.citiesList      = [...(emp.assignedCities || [])];
    this.cityCityInput   = '';
    this.citiesError     = '';
    this.showCitiesModal = true;
  }

  addCitiesTag(): void {
    const c = this.cityCityInput.trim();
    if (c && !this.citiesList.includes(c)) { this.citiesList.push(c); }
    this.cityCityInput = '';
  }

  addCitiesOnEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') { event.preventDefault(); this.addCitiesTag(); }
  }

  removeCityTag(i: number): void { this.citiesList.splice(i, 1); }

  saveCities(): void {
    this.isSavingCities = true; this.citiesError = '';
    this.parcelService.updateEmployeeCities(this.citiesEmployee._id, this.citiesList).subscribe({
      next: () => {
        this.citiesEmployee.assignedCities = [...this.citiesList];
        this.showCitiesModal = false;
        this.isSavingCities  = false;
        this.loadEmployees();
      },
      error: (err) => {
        this.citiesError    = err?.error?.message || 'Failed to save cities';
        this.isSavingCities = false;
      }
    });
  }
}