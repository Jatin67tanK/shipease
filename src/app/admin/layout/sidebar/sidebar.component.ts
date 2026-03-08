import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  mobileOpen = false;

  menuItems = [
    { label: 'Dashboard',    link: '/admin/dashboard',   icon: '📊' },
    { label: 'Active Parcels', link: '/admin/parcels/active', icon: '📦' },
    { label: 'Non-Active',   link: '/admin/parcels/non-active', icon: '🗃️' },
    { label: 'Pricing',      link: '/admin/pricing',     icon: '💰' },
    { label: 'Employees',    link: '/admin/employees',   icon: '👷' }, // ✅ NEW
    { label: 'Profile',      link: '/admin/profile',     icon: '👤' },
  ];

  constructor(private authService: AuthService) {}

  onToggle() { this.toggle.emit(); }

  logout() { this.authService.logout(); }
}
