import { Component } from '@angular/core';

@Component({
  selector: 'app-delivery-layout',
  templateUrl: './delivery-layout.component.html'
})
export class DeliveryLayoutComponent {
  collapsed = false;
  toggleSidebar() { this.collapsed = !this.collapsed; }
}
