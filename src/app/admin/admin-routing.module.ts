import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActiveParcelsComponent } from './pages/active-parcels/active-parcels.component';
import { NonActiveParcelsComponent } from './pages/non-active-parcels/non-active-parcels.component';
import { PricingManagementComponent } from './pages/pricing-management/pricing-management.component';

import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { TrackParcelComponent } from './../customer/pages/track-parcel/track-parcel.component'
import { ShipmentHistoryComponent } from './../customer/pages/track-parcel/shipment-history.component';
import { DeliveredHistoryComponent } from './../customer/pages/track-parcel/delivered-history.component';
import { RefundedHistoryComponent } from './../customer/pages/track-parcel/refunded-history.component';
const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [

      { path: 'dashboard', component: DashboardComponent },
      // { path: 'active-parcels', component: ActiveParcelsComponent },
     { path: 'parcels/:status', component: ActiveParcelsComponent },
      { path: 'pricing', component: PricingManagementComponent },

      /* ✅ PROFILE */
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit', component: EditProfileComponent },
      // {
      //   path: 'track',
      //   component: TrackParcelComponent
      // },

      // {
      //   path: 'history',
      //   component: ShipmentHistoryComponent,
      //   children: [
      //     { path: '', component: DeliveredHistoryComponent },
      //     { path: 'refunded', component: RefundedHistoryComponent }
      //   ]
      // }



      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }