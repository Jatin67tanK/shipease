import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact-routing.module';

import { LayoutSharedModule } from '../../layout/layout-shared/layout-shared.module';

@NgModule({
  declarations: [
    ContactComponent 
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    FormsModule,
    LayoutSharedModule
  ]
})
export class ContactModule {}