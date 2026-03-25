import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-delivery-sidebar',
  templateUrl: './delivery-sidebar.component.html'
})
export class DeliverySidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

 menuItems = [
    { label: 'Dashboard', link: '/delivery/dashboard', icon: 'fas fa-chart-line' },
    { label: 'My Parcels', link: '/delivery/parcels', icon: 'fas fa-box' },
    { label: 'Profile', link: '/delivery/profile', icon: 'fas fa-user' }
  ];

  constructor(private authService: AuthService) {}

  onToggle() { this.toggle.emit(); }

  logout() { this.authService.logout(); }
}
