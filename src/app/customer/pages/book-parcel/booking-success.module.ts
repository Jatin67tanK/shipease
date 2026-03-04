import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingSuccessComponent } from './booking-success.component';
import { BookingSuccessRoutingModule } from './booking-success-routing.module';

@NgModule({
  declarations: [
    BookingSuccessComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BookingSuccessRoutingModule
  ]
})
export class BookingSuccessModule {}