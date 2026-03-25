import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  @Input() collapsed = false;

  menuItems = [
    { icon: 'fas fa-chart-line', label: 'Dashboard', route: '/customer' },
    { icon: '📦', label: 'Book Parcel', route: '/customer/book' },
    { icon: '🔍', label: 'Track Parcel', route: '/customer/track' },
    { icon: '👤', label: 'My Profile', route: '/customer/profile' },
    { icon: '🚪', label: 'Log out', route: '/' }
  ];
}