import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./Public/pages/landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'track',
    loadChildren: () =>
      import('./Public/pages/track-parcel/track-parcel.module').then(m => m.TrackParcelModule)
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./Public/pages/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./Public/pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./Public/pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'customer',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'admin',
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule)
  },
  // ✅ NEW: Delivery Staff Panel
  {
    path: 'delivery',
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['Employee'] },
    loadChildren: () =>
      import('./delivery/delivery.module').then(m => m.DeliveryModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
