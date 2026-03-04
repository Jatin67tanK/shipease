// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(): boolean {

//     const token = localStorage.getItem('token');

//     if (!token) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     return true;
//   }
// }

import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/']);
    return false;
  }

  return true;
};