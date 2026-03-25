import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

import { PublicRoutingModule }   from './public-routing.module';  // provides RouterModule via forChild

import { HeaderComponent }       from './layout/header/header.component';
import { FooterComponent }       from './layout/footer/footer.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PublicShellComponent }  from './layout/public-shell/public-shell.component';

import { LandingComponent }      from './pages/landing/landing.component';
import { LoginComponent }        from './pages/login/login.component';
import { RegisterComponent }     from './pages/register/register.component';
import { TrackParcelComponent }  from './pages/track-parcel/track-parcel.component';
import { VerifyOtpComponent }    from './pages/verify-otp/verify-otp.component';
import { ContactComponent }      from './pages/contact/contact.component';

@NgModule({
  declarations: [
    // Layout
    HeaderComponent,
    FooterComponent,
    PublicLayoutComponent,
    PublicShellComponent,

    // Pages
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    TrackParcelComponent,
    VerifyOtpComponent,
    ContactComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PublicRoutingModule,
    // ✅ NO standalone RouterModule here — PublicRoutingModule already exports it
  ]
})
export class PublicModule {}