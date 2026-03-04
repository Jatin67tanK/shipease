import { Component } from '@angular/core';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html'
})
export class ShipmentsComponent {

  showBookingModal = false;

  openBookingModal() {
    this.showBookingModal = true;
  }

  closeBookingModal() {
    this.showBookingModal = false;
  }
}