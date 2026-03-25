import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
 constructor(
    private router: Router,
  ) {}


  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();
  menuItems = [
    { label: 'Dashboard', icon: 'fas fa-chart-line', link: 'shipments' },
    { label: 'Book Parcel', icon: 'fas fa-box', link: 'book' },
    { label: 'Track Parcel', icon: 'fas fa-location-dot', link: 'track' },
    { label: 'My Profile', icon: 'fas fa-user', link: 'profile' }
  ];

  onToggle(): void {
    this.toggle.emit();
  }

  goToHome(){
    this.router.navigate(['/']);
  }

  // auth.service.ts

logout(): void {
  // 1. Clear tokens from storage
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  
  // 2. Clear any temporary session data
  sessionStorage.removeItem('tempToken');
      this.router.navigate(['/']);
  
  // 3. Optional: Clear all if you don't store other preferences
  // localStorage.clear();
  // sessionStorage.clear();
}
}