import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  menuItems = [
   // { label: '', icon: '', link: '' },            // ✅ FIXED
  
  { label: 'Dashboard', icon: '📊', link: 'shipments' },   
  { label: 'Book Parcel', icon: '📦', link: 'book' },
  { label: 'Track Parcel', icon: '📍', link: 'track' },
  { label: 'My Profile', icon: '👤', link: 'profile' }

  ];

  onToggle(): void {
    this.toggle.emit();
  }
}