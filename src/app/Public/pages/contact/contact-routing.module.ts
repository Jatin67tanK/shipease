import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicShellComponent } from '../../layout/public-shell/public-shell.component';
import { ContactComponent } from './contact.component';

const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      { path: '', component: ContactComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule {}