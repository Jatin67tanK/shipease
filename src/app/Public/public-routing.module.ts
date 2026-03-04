import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TrackParcelComponent } from './pages/track-parcel/track-parcel.component';
import { PublicShellComponent } from './layout/public-shell/public-shell.component';

// const routes: Routes = [
//   { path: '', component: LandingComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'track', component: TrackParcelComponent }
// ];
const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,   // 😈🔥 THIS IS THE KEY
    children: [

      { path: '', component: LandingComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'track', component: TrackParcelComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}