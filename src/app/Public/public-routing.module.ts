import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicShellComponent }  from './layout/public-shell/public-shell.component';
import { LandingComponent }      from './pages/landing/landing.component';
import { LoginComponent }        from './pages/login/login.component';
import { RegisterComponent }     from './pages/register/register.component';
import { TrackParcelComponent }  from './pages/track-parcel/track-parcel.component';
import { VerifyOtpComponent }    from './pages/verify-otp/verify-otp.component';
import { ContactComponent }      from './pages/contact/contact.component';

const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      { path: '',           component: LandingComponent,     pathMatch: 'full' },
      { path: 'login',      component: LoginComponent },
      { path: 'register',   component: RegisterComponent },
      { path: 'track',      component: TrackParcelComponent },
      { path: 'verify-otp', component: VerifyOtpComponent },
      { path: 'contact',    component: ContactComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}