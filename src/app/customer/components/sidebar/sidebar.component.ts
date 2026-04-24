import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  @Input() collapsed = false;

  menuItems = [
    { icon: 'fas fa-chart-line', label: 'Dashboard', route: '/customer' },
    { icon: 'fas fa-box', label: 'Book Parcel', route: '/customer/book' },
    { icon: 'fas fa-magnifying-glass', label: 'Track Parcel', route: '/customer/track' },
    { icon: 'fas fa-user', label: 'My Profile', route: '/customer/profile' },
    { icon: 'fas fa-right-from-bracket', label: 'Log out', route: '/' }
  ];
}
