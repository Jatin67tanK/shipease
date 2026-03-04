import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LayoutSharedModule } from '../../layout/layout-shared/layout-shared.module';

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    LayoutSharedModule 
  ]
})

export class LandingModule {}