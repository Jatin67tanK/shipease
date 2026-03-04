import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveParcelsComponent } from './active-parcels.component';
import { InactiveParcelsComponent } from './inactive-parcels.compnent';

const routes: Routes = [
  { path: 'active', component: ActiveParcelsComponent },
  { path: 'inactive', component: InactiveParcelsComponent },
  { path: '', redirectTo: 'active', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentsRoutingModule {}