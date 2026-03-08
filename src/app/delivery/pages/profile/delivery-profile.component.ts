import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-delivery-profile',
  templateUrl: './delivery-profile.component.html'
})
export class DeliveryProfileComponent implements OnInit {

  profile: any = null;
  editMode = false;
  isLoading = true;
  isSaving = false;

  form = { name: '', phone_number: '', state: '', country: '' };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getEmployeeProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data;
        this.form = {
          name: res.data.name,
          phone_number: res.data.phone_number,
          state: res.data.state,
          country: res.data.country,
        };
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  saveProfile(): void {
    this.isSaving = true;
    this.authService.updateEmployeeProfile(this.form).subscribe({
      next: () => {
        this.profile = { ...this.profile, ...this.form };
        this.editMode = false;
        this.isSaving = false;
      },
      error: (err) => {
        alert(err?.error?.message || 'Update failed');
        this.isSaving = false;
      }
    });
  }
}
