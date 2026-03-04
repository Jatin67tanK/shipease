import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html'
})
export class CustomerLayoutComponent implements OnInit {

  isSidebarOpen = true;
  isMobile = false;

  ngOnInit(): void {
    this.checkScreen();
  }

  @HostListener('window:resize')
  checkScreen(): void {
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}