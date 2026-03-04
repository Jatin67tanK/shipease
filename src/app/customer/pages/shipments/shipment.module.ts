import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShipmentsComponent } from './shipments.component';
import { ActiveParcelsComponent } from './active-parcels.component';
import { InactiveParcelsComponent } from './inactive-parcels.compnent';

import { ShipmentsRoutingModule } from './shipment-routing.module';

@NgModule({
  declarations: [
    ShipmentsComponent,
    ActiveParcelsComponent,
    InactiveParcelsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShipmentsRoutingModule
  ]
})
export class ShipmentsModule {}