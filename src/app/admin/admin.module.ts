import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule }           from './admin-routing.module';
import { SharedModule }                 from '../shared/shared.module';

// ── Layout ───────────────────────────────────────────────
import { AdminLayoutComponent }         from './layout/admin-layout/admin-layout.component';
import { SidebarComponent }             from './layout/sidebar/sidebar.component';
import { HeaderComponent }              from './layout/header/header.component';

// ── Existing Pages ───────────────────────────────────────
import { DashboardComponent }           from './pages/dashboard/dashboard.component';
import { ActiveParcelsComponent }       from './pages/active-parcels/active-parcels.component';
import { NonActiveParcelsComponent }    from './pages/non-active-parcels/non-active-parcels.component';
import { PricingManagementComponent }   from './pages/pricing-management/pricing-management.component';
import { EditProfileComponent }         from './pages/edit-profile/edit-profile.component';
import { EmployeeManagementComponent }  from './pages/employee-management/employee-management.component';

// ── NEW Pages ────────────────────────────────────────────
import { EmployeeProgressComponent }    from './pages/employee-progress/employee-progress.component';
import { UnassignedParcelsComponent }   from './pages/unassigned-parcels/unassigned-parcels.component';
import { CycleHistoryComponent }        from './pages/cycle-history/cycle-history.component';
import { AdminChartsComponent }         from './pages/charts/admin-charts.component';

@NgModule({
  declarations: [
    // Layout
    AdminLayoutComponent,
    SidebarComponent,
    HeaderComponent,

    // Existing
    DashboardComponent,
    ActiveParcelsComponent,
    NonActiveParcelsComponent,
    PricingManagementComponent,
    EditProfileComponent,
    EmployeeManagementComponent,

    // ✅ NEW
    EmployeeProgressComponent,
    UnassignedParcelsComponent,
    CycleHistoryComponent,
    AdminChartsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AdminRoutingModule,
    SharedModule,      // ← brings in ProfileComponent
  ]
})
export class AdminModule {}
