import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { PublicShellComponent } from '../../layout/public-shell/public-shell.component';
// landing-routing.module.ts
const routes: Routes = [
  { 
    path: '', 
    component: LandingComponent // Load the component directly if not lazy-loading this specific part
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {}