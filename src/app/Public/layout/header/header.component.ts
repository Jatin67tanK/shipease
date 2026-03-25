import { Component } from '@angular/core';
import { Router }     from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector:    'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  sidebarOpen = false;

  constructor(
    private router:      Router,
    private authService: AuthService
  ) {}

  get isLoggedIn(): boolean { return this.authService.isLoggedIn(); }
  get userRole():   string  { return this.authService.getRole();    }

  // ── Nav link methods ──────────────────────────────────────
  goToHome():    void { this.router.navigate(['/']);        this.closeSidebar(); }
  goToTrack():   void { this.router.navigate(['/track']);   this.closeSidebar(); }
  goToContact(): void { this.router.navigate(['/contact']); this.closeSidebar(); }

  // ── Auth ──────────────────────────────────────────────────
  goToLogin():    void { this.router.navigate(['/login']);    this.closeSidebar(); }
  goToRegister(): void { this.router.navigate(['/register']); this.closeSidebar(); }

  goToDashboard(): void {
    const routes: Record<string, string> = {
      Admin:    '/admin/dashboard',
      Employee: '/delivery/dashboard',
      Customer: '/customer/shipments',
    };
    this.router.navigate([routes[this.authService.getRole()] || '/login']);
    this.closeSidebar();
  }

  logout(): void {
    this.authService.logout();
    this.closeSidebar();
  }

  bookParcel(): void {
    this.isLoggedIn
      ? this.router.navigate(['/customer/book'])
      : this.router.navigate(['/login']);
    this.closeSidebar();
  }

  // ── Active route helper ───────────────────────────────────
  isActive(path: string): boolean {
    return path === '/'
      ? this.router.url === '/'
      : this.router.url.startsWith(path);
  }

  // ── Sidebar ───────────────────────────────────────────────
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar():  void { this.sidebarOpen = false; }
}