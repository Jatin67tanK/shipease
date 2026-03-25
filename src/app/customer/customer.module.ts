import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing.module';

import { CustomerLayoutComponent } from './layout/customer-layout/customer-layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

import { ShipmentsComponent } from './pages/shipments/shipments.component';
import { ActiveParcelsComponent } from './pages/shipments/active-parcels.component';
import { InactiveParcelsComponent } from './pages/shipments/inactive-parcels.compnent';

import { BookParcelComponent } from './pages/book-parcel/book-parcel.component';
import { CheckoutComponent } from './pages/book-parcel/checkout.component';
import { BookingSuccessComponent } from './pages/book-parcel/booking-success.component';

import { TrackParcelComponent } from './pages/track-parcel/track-parcel.component';
import { ShipmentHistoryComponent } from './pages/track-parcel/shipment-history.component';
import { DeliveredHistoryComponent } from './pages/track-parcel/delivered-history.component';
import { RefundedHistoryComponent } from './pages/track-parcel/refunded-history.component';

import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/profile/edit-profile.component';

/* ✅ ADD THIS */

@NgModule({
  declarations: [
    CustomerLayoutComponent,
    SidebarComponent,
    ShipmentsComponent,
    ActiveParcelsComponent,
    InactiveParcelsComponent,

    BookParcelComponent,
    CheckoutComponent,
    BookingSuccessComponent,

    TrackParcelComponent,
    ShipmentHistoryComponent,
    DeliveredHistoryComponent,
    RefundedHistoryComponent,

    ProfileComponent,
    EditProfileComponent,

    /* ✅ ADD THIS */
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }