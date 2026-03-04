// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class RoleGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(): boolean {

//     const profile = localStorage.getItem('profile');

//     if (!profile) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     const user = JSON.parse(profile);

//     if (user.role !== 'Admin') {
//       this.router.navigate(['/customer']);
//       return false;
//     }

//     return true;
//   }
// }
// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class RoleGuard implements CanActivate {

//   constructor(private router: Router) {
    
//   }

//   canActivate(): boolean {

//     const token = localStorage.getItem('token');

//     if (!token) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     try {

//       /* ✅ Decode JWT Payload */
//       const payload = JSON.parse(atob(token.split('.')[1]));

//       if (payload.role !== 'Admin') {
//         this.router.navigate(['/customer']);
//         return false;
//       }

//       return true;

//     } catch (error) {

//       console.warn('Invalid Token:', error);
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }


import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

export const RoleGuard = (route: ActivatedRouteSnapshot) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const allowedRoles = route.data?.['roles'];

    if (!allowedRoles || allowedRoles.includes(payload.role)) {
      return true;
    }

    router.navigate(['/customer']);
    return false;

  } catch (error) {
    console.warn('Invalid Token:', error);
    router.navigate(['/login']);
    return false;
  }
};