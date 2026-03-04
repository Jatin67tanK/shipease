import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PublicRoutingModule } from './public-routing.module';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PublicShellComponent } from './layout/public-shell/public-shell.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PublicLayoutComponent,
    PublicShellComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule
  ]
})
export class PublicModule {}