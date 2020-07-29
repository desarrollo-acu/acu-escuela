import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';


import { MatNativeDateModule } from '@angular/material/core';



import localeEsAr from '@angular/common/locales/global/es-AR';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsAr, 'es-AR');

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MaterialModule,
    CoreModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    SharedModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-AR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
