import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* ✅ FULLSCREEN PAGE */
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';

/* ✅ LAYOUT */
import { CustomerLayoutComponent } from './layout/customer-layout/customer-layout.component';

/* ✅ PAGES */
import { BookParcelComponent } from './pages/book-parcel/book-parcel.component';
import { CheckoutComponent } from './pages/book-parcel/checkout.component';
import { BookingSuccessComponent } from './pages/book-parcel/booking-success.component';

import { TrackParcelComponent } from './pages/track-parcel/track-parcel.component';
import { ShipmentHistoryComponent } from './pages/track-parcel/shipment-history.component';
import { DeliveredHistoryComponent } from './pages/track-parcel/delivered-history.component';
import { RefundedHistoryComponent } from './pages/track-parcel/refunded-history.component';

import { ProfileComponent } from './pages/profile/profile.component';
import { ShipmentsComponent } from './pages/shipments/shipments.component';
import { ActiveParcelsComponent } from './pages/shipments/active-parcels.component';
import { InactiveParcelsComponent } from './pages/shipments/inactive-parcels.compnent';
import { EditProfileComponent } from './pages/profile/edit-profile.component';

const routes: Routes = [

  /* ✅ NO SIDEBAR ROUTE */
  {
    path: 'verify-otp',
    component: VerifyOtpComponent
  },

  /* ✅ SIDEBAR LAYOUT ROUTES */
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [

      { path: '', redirectTo: 'shipments', pathMatch: 'full' },

      {
        path: 'book',
        children: [
          { path: '', component: BookParcelComponent },
          { path: 'checkout', component: CheckoutComponent },
          { path: 'success', component: BookingSuccessComponent }
        ]
      },

      {
        path: 'track',
        children: [
          { path: '', component: TrackParcelComponent },

          {
            path: 'history',
            component: ShipmentHistoryComponent,
            children: [
              { path: '', component: DeliveredHistoryComponent },
              { path: 'refunded', component: RefundedHistoryComponent }
            ]
          }
        ]
      },

      {
        path: 'shipments',
        component: ShipmentsComponent,
        children: [
          { path: '', redirectTo: 'active', pathMatch: 'full' },
          { path: 'active', component: ActiveParcelsComponent },
          { path: 'inactive', component: InactiveParcelsComponent }
        ]
      },

      {
        path: 'profile',
        children: [
          { path: '', component: ProfileComponent },
          { path: 'edit', component: EditProfileComponent }
        ]
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }