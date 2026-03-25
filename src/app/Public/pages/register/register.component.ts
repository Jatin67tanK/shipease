// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-register',
// //   templateUrl: './register.component.html'
// // })
// // export class RegisterComponent {

// //   registerData = {
// //     fullName: '',
// //     email: '',
// //     password: '',
// //     phone: '',
// //     state: '',
// //     country: ''
// //   };

// //   submitted = false;

// //   showPassword = false;

// //   togglePassword() {
// //     this.showPassword = !this.showPassword;
// //   }

// //   onRegister(form: any) {

// //     this.submitted = true;

// //     if (form.invalid) return;

// //     console.log('Register Data:', this.registerData);

// //     // Future → API Call 😌
// //   }

// // }
// import { Component } from '@angular/core';
// import { AuthService } from '../../../core/services/auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html'
// })
// export class RegisterComponent {

//   registerData = {
//     name: '',              // ✅ Backend Match
//     email: '',
//     password: '',
//     phone_number: '',      // ✅ Backend Match
//     state: '',
//     country: ''
//   };

//   submitted = false;
//   showPassword = false;
//   errorMessage = '';
//   successMessage = '';

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) { }

//   togglePassword() {
//     this.showPassword = !this.showPassword;
//   }

//   onRegister(form: any) {

//     this.submitted = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     if (form.invalid) return;

//     console.log('Register Payload:', this.registerData);

//     this.authService.register(this.registerData).subscribe({
//       next: (response: any) => {

//         console.log('Register Success:', response);

//         this.successMessage = response.message;

//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 1200);
//       },
//       error: (error) => {

//         console.error('Register Error:', error);

//         this.errorMessage =
//           error?.error?.message || 'Registration failed.';
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  registerData = {
    name: '',
    email: '',
    password: '',
    phone_number: '',
    state: '',
    country: ''
  };

  submitted = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /* ✅ ANGULAR-SAFE PHONE FILTER 😏 */
  allowOnlyNumbers(event: any) {

    const input = event.target.value;

    this.registerData.phone_number = input
      .replace(/\D/g, '')      // remove non-digits
      .slice(0, 10);           // HARD LIMIT → 10 digits
  }

  onRegister(form: any) {

    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) return;

     console.log('Register Payload:', this.registerData);

    this.authService.register(this.registerData).subscribe({
      next: (response: any) => {

        this.successMessage = response.message || 'Registration successful';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (error) => {

        this.errorMessage =
          error?.error?.message || 'Registration failed.';
      }
    });
  }
}