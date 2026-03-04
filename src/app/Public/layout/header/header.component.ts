import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  sidebarOpen = false;

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Track Parcel', path: '/track' },
    { label: 'Contact Us', path: '/contact' }
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}