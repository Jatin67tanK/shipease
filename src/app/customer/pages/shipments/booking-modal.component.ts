import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html'
})
export class BookingModalComponent {

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}