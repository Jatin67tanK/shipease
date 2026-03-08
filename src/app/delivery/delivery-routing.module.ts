import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryLayoutComponent } from './layout/delivery-layout/delivery-layout.component';
import { DeliveryDashboardComponent } from './pages/dashboard/delivery-dashboard.component';
import { AssignedParcelsComponent } from './pages/assigned-parcels/assigned-parcels.component';
import { ProfileComponent } from '../admin/pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: DeliveryLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DeliveryDashboardComponent },
      { path: 'parcels', component: AssignedParcelsComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryRoutingModule {}
