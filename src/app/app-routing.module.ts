import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard }            from './core/guards/auth.guard';
import { RoleGuard }            from './core/guards/role.guard';

const routes: Routes = [
  // ── Public ───────────────────────────────────────────────
  {
    path: '',
    loadChildren: () =>
      import('./Public/public.module').then(m => m.PublicModule)
  },

  // ── Customer ─────────────────────────────────────────────
  {
    path: 'customer',
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['Customer'] },
    loadChildren: () =>
      import('./customer/customer.module').then(m => m.CustomerModule)
  },

  // ── Admin ─────────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule)
  },

  // ── Delivery Staff ─────────────────────────────────────────
  {
    path: 'delivery',
    canActivate: [authGuard, RoleGuard],
    data: { roles: ['Employee'] },
    loadChildren: () =>
      import('./delivery/delivery.module').then(m => m.DeliveryModule)
  },

  // ── Fallback ──────────────────────────────────────────────
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
