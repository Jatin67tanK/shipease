import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  profile: any = null;
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {

    this.authService.getProfile().subscribe({

      next: (res: any) => {
        this.profile = res.data;
        this.isLoading = false;
      },

      error: () => {
        alert("Failed to load profile 💀");
        this.isLoading = false;
      }
    });
  }
}