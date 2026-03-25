import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent }         from './layout/admin-layout/admin-layout.component';
import { DashboardComponent }           from './pages/dashboard/dashboard.component';
import { ActiveParcelsComponent }       from './pages/active-parcels/active-parcels.component';
import { PricingManagementComponent }   from './pages/pricing-management/pricing-management.component';
import { ProfileComponent }             from '../shared/shared.module';           // via SharedModule
import { EmployeeManagementComponent }  from './pages/employee-management/employee-management.component';

// ── NEW pages ──────────────────────────────────────────────
import { EmployeeProgressComponent }    from './pages/employee-progress/employee-progress.component';
import { UnassignedParcelsComponent }   from './pages/unassigned-parcels/unassigned-parcels.component';
import { CycleHistoryComponent }        from './pages/cycle-history/cycle-history.component';
import { AdminChartsComponent }         from './pages/charts/admin-charts.component';
import { CustomerManagementComponent } from './pages/customer-management/customer-management.component';
import { CheckoutComponent } from '../customer/pages/book-parcel/checkout.component';
import { BookingSuccessComponent } from '../customer/pages/book-parcel/booking-success.component';
  import { BookParcelComponent } from '../customer/pages/book-parcel/book-parcel.component';
const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '',                  redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',         component: DashboardComponent            },
      {
             path: 'book/:role',
             children: [
               { path: '', component: BookParcelComponent },
               { path: 'checkout', component: CheckoutComponent },
               { path: 'success', component: BookingSuccessComponent }
             ]
           },
      { path: 'parcels/:status', component: ActiveParcelsComponent },
      { path: 'pricing',           component: PricingManagementComponent    },
      { path: 'profile',           component: ProfileComponent              },
      { path: 'employees',         component: EmployeeManagementComponent   },
      { path: 'customer',         component: CustomerManagementComponent   },
      // ── NEW ───────────────────────────────────────────────
      { path: 'employee-progress', component: EmployeeProgressComponent     },
      { path: 'unassigned-parcels',component: UnassignedParcelsComponent    },
      { path: 'cycle-history',     component: CycleHistoryComponent         },
      { path: 'charts',            component: AdminChartsComponent           },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
