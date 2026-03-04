import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {

  profile: any = {
    name: '',
    phone_number: '',
    state: '',
    country: ''
  };

  isSaving = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data;
      }
    });
  }

  saveChanges(): void {

    this.isSaving = true;

    this.authService.updateProfile(this.profile).subscribe({

      next: () => {
        alert("Profile updated 😎🔥");
        this.router.navigate(['/admin/profile']);
      },

      error: () => {
        alert("Update failed 💀");
        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/profile']);
  }
}