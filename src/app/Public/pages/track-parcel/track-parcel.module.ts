import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // ✅🔥🔥🔥

import { TrackParcelComponent } from './track-parcel.component';
import { TrackParcelRoutingModule } from './track-parcel-routing.module';

import { LayoutSharedModule } from '../../layout/layout-shared/layout-shared.module';

@NgModule({
  declarations: [
    TrackParcelComponent
  ],
  imports: [
    CommonModule,
    TrackParcelRoutingModule,
    FormsModule,          
    LayoutSharedModule
  ]
})
export class TrackParcelModule {}