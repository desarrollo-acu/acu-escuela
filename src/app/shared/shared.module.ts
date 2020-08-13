import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaySpanishPipe } from './pipes/day-spanish.pipe';
import { CiPipe } from './pipes/ci.pipe';
import { ValueIPipe } from './pipes/value-i.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HoraNumericStringPipe } from './pipes/hora-numeric-string.pipe';
import { CustomDateFormatPipePipe } from './pipes/custom-date-format-pipe.pipe';
import { DayToStringPipe } from './pipes/day-to-string.pipe';
import { FechaStringPipe } from './pipes/fecha-string.pipe';



@NgModule({
  declarations: [
    DaySpanishPipe,
    CiPipe,
    ValueIPipe,
    FooterComponent,
    HeaderComponent,
    HoraNumericStringPipe,
    CustomDateFormatPipePipe,
    DayToStringPipe,
    FechaStringPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ValueIPipe,
    DaySpanishPipe,
    CiPipe,
    DayToStringPipe,
    FooterComponent,
    HeaderComponent,
    HoraNumericStringPipe,
    FechaStringPipe

  ],
})
export class SharedModule { }
