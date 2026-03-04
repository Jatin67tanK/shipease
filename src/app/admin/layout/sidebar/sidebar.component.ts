import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  /* ✅ Controlled by Parent (PC View) */
  @Input() collapsed = false;

  /* ✅ Notify Parent (PC Collapse) */
  @Output() toggle = new EventEmitter<void>();

  /* ✅ Mobile Drawer State (Internal) */
  mobileOpen = false;

  /* ✅ Menu Items */
  menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      link: '/admin/dashboard'
    },
   {
  label: 'Active Parcels',
  icon: '📦',
  link: '/admin/parcels/active'
},
{
  label: 'Non-Active Parcels',
  icon: '🗂',
  link: '/admin/parcels/non-active'
},
    {
      label: 'Pricing Management',
      icon: '💰',
      link: '/admin/pricing'
    },
    {
      label: 'My Profile',
      icon: '👤',
      link: '/admin/profile'
    }
    // { icon: '🔍', label: 'Track Parcel', link: '/admin/track' },
  ];

  /* ✅ Smart Toggle Behaviour */
  onToggle(): void {

    if (window.innerWidth < 1024) {
      // ✅ Mobile → Open Drawer
      this.mobileOpen = !this.mobileOpen;
    } else {
      // ✅ PC → Ask Parent to Collapse
      this.toggle.emit();
    }

  }

  /* ✅ Close Sidebar After Click (Mobile Only) */
  onMobileItemClick(): void {

    if (window.innerWidth < 1024) {
      this.mobileOpen = false;
    }

  }
}