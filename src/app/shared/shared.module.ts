import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { RouterModule }  from '@angular/router';

// ✅ ProfileComponent declared ONCE here
// It detects role from JWT and loads the correct profile (Admin / Customer / Employee)
import { ProfileComponent } from '../admin/pages/profile/profile.component';

export { ProfileComponent };   // re-export so it can be imported directly in routing files

@NgModule({
  declarations: [
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    ProfileComponent,   // ← other modules can use <app-profile> and route to it
  ]
})
export class SharedModule {}
