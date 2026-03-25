import { NgModule }                              from '@angular/core';
import { BrowserModule }                         from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS }   from '@angular/common/http';
import { FormsModule }                           from '@angular/forms';
import { CommonModule }                          from '@angular/common';

import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

// ✅ LoginComponent and RegisterComponent are declared in PublicModule
// ❌ Do NOT import or declare them here

@NgModule({
  declarations: [
    AppComponent,   // ← only AppComponent lives here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}