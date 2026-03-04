import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shipment-history',
  templateUrl: './shipment-history.component.html'
})
export class ShipmentHistoryComponent {

  trackingId = '';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.trackingId = params['id'];
    });
  }
}