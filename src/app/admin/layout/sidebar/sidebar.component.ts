import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router }    from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  @Input() collapsed = false;            // ← correct
  @Output() toggle = new EventEmitter<void>();

  menuItems = [
   { label: 'Dashboard',          link: '/admin/dashboard',          icon: 'fa-house'                },
  //  { label: 'Book Parcel',          link: '/admin/book/admin',          icon: 'fa-box-open'                },
{ label: 'Active Parcels',     link: '/admin/parcels/active',     icon: 'fa-box'           },
{ label: 'Non-Active Parcels', link: '/admin/parcels/non-active', icon: 'fa-boxes-stacked' },
{ label: 'Customer',          link: '/admin/customer',          icon: 'fa-users'             },
{ label: 'Pricing',            link: '/admin/pricing',            icon: 'fa-tag'                  },
{ label: 'Employees',          link: '/admin/employees',          icon: 'fa-hard-hat'             },
{ label: 'Employee Progress',  link: '/admin/employee-progress',  icon: 'fa-chart-line'           },
{ label: 'Unassigned Parcels', link: '/admin/unassigned-parcels', icon: 'fa-triangle-exclamation' },
{ label: 'Cycle History',      link: '/admin/cycle-history',      icon: 'fa-rotate'               },
// { label: 'Analytics',          link: '/admin/charts',             icon: 'fa-chart-bar'            },
{ label: 'Profile',            link: '/admin/profile',            icon: 'fa-user'                 },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.toggle.emit();  // emit to parent
  }
}