import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrackParcelComponent } from './track-parcel.component';
import { PublicShellComponent } from '../../layout/public-shell/public-shell.component';

const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      { path: '', component: TrackParcelComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackParcelRoutingModule {}