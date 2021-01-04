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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';



import * as localeEsUy from '@angular/common/locales/global/es-UY';
import { registerLocaleData } from '@angular/common';
import { ExisteAlumnoByCiValidatorDirective } from './utils/validators/existe-alumno-by-ci-validator.directive';
// import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

registerLocaleData(localeEsUy, 'es-UY');
import { BlockUIModule } from 'ng-block-ui';
import { CargandoInterceptor } from './interceptos/cargando.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ExisteAlumnoByCiValidatorDirective
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

    BlockUIModule.forRoot({
      delayStop: 200,
      message: 'Cargando',
    }),
    SharedModule
  ],

  providers: [

    {
      provide: HTTP_INTERCEPTORS,
      useClass: CargandoInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
