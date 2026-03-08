import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActiveParcelsComponent } from './pages/active-parcels/active-parcels.component';
import { NonActiveParcelsComponent } from './pages/non-active-parcels/non-active-parcels.component';
import { PricingManagementComponent } from './pages/pricing-management/pricing-management.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'parcels/:status', component: ActiveParcelsComponent },
      { path: 'pricing', component: PricingManagementComponent },
      { path: 'employees', component: EmployeeManagementComponent }, // ✅ NEW
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit', component: EditProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
