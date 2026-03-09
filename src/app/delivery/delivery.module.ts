import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DeliveryRoutingModule }      from './delivery-routing.module';
import { SharedModule }               from '../shared/shared.module';

import { DeliveryLayoutComponent }    from './layout/delivery-layout/delivery-layout.component';
import { DeliverySidebarComponent }   from './layout/sidebar/delivery-sidebar.component';
import { DeliveryDashboardComponent } from './pages/dashboard/delivery-dashboard.component';
import { AssignedParcelsComponent }   from './pages/assigned-parcels/assigned-parcels.component';

// ✅ ProfileComponent is declared in SharedModule — NOT here

@NgModule({
  declarations: [
    DeliveryLayoutComponent,
    DeliverySidebarComponent,
    DeliveryDashboardComponent,
    AssignedParcelsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DeliveryRoutingModule,
    SharedModule,    // ← brings ProfileComponent in
  ]
})
export class DeliveryModule {}
