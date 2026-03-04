import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

/* LAYOUT */
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

/* PAGES */
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActiveParcelsComponent } from './pages/active-parcels/active-parcels.component';
import { NonActiveParcelsComponent } from './pages/non-active-parcels/non-active-parcels.component';
import { PricingManagementComponent } from './pages/pricing-management/pricing-management.component';

import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    SidebarComponent,
    HeaderComponent,

    DashboardComponent,
    ActiveParcelsComponent,
    NonActiveParcelsComponent,
    PricingManagementComponent,

    ProfileComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,     // ✅ REQUIRED
    RouterModule,     // ✅ REQUIRED
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}