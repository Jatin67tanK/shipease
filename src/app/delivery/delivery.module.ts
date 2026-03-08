import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryLayoutComponent } from './layout/delivery-layout/delivery-layout.component';
import { DeliverySidebarComponent } from './layout/sidebar/delivery-sidebar.component';
import { DeliveryDashboardComponent } from './pages/dashboard/delivery-dashboard.component';
import { AssignedParcelsComponent } from './pages/assigned-parcels/assigned-parcels.component';
import { DeliveryProfileComponent } from './pages/profile/delivery-profile.component';

@NgModule({
  declarations: [
    DeliveryLayoutComponent,
    DeliverySidebarComponent,
    DeliveryDashboardComponent,
    AssignedParcelsComponent,
    DeliveryProfileComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule, DeliveryRoutingModule]
})
export class DeliveryModule {}
