import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // ✅🔥🔥🔥

import { RegisterComponent } from './register.component'; 
import { RegisterRoutingModule } from './register-routing.module';

import { LayoutSharedModule } from '../../layout/layout-shared/layout-shared.module';  // ✅🔥🔥🔥

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,          // ✅🔥 CRITICAL FIX
    // LayoutSharedModule
  ]
})
export class RegisterModule {}