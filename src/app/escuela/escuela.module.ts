import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscuelaRoutingModule } from './escuela-routing.module';
import { AgendaMovilComponent } from './components/agenda-movil/agenda-movil.component';
import { AgendaInstructorComponent } from './components/agenda-instructor/agenda-instructor.component';
import { AgendaCursoComponent } from './components/modals/agenda-curso/agenda-curso.component';
import { AltaAlumnoComponent } from './components/modals/alta-alumno/alta-alumno.component';
import { FacturaRutComponent } from './components/modals/factura-rut/factura-rut.component';
import { InscripcionCursoComponent } from './components/modals/inscripcion-curso/inscripcion-curso.component';
import { PedirCantidadClasesComponent } from './components/modals/pedir-cantidad-clases/pedir-cantidad-clases.component';
import { SeleccionarAccionAgendaComponent } from './components/modals/seleccionar-accion-agenda/seleccionar-accion-agenda.component';
import { SeleccionarAlumnoComponent } from './components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { SeleccionarCursoComponent } from './components/modals/seleccionar-curso/seleccionar-curso.component';
import { SeleccionarFechaComponent } from './components/modals/seleccionar-fecha/seleccionar-fecha.component';
import { SeleccionarInstructorComponent } from './components/modals/seleccionar-instructor/seleccionar-instructor.component';
import { SeleccionarItemsFacturarComponent } from './components/modals/seleccionar-items-facturar/seleccionar-items-facturar.component';
import { NavComponent } from './components/nav/nav.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AgendarClaseComponent } from './components/modals/agendar-clase/agendar-clase.component';
import { SeleccionarSocioComponent } from './components/modals/seleccionar-socio/seleccionar-socio.component';
import { ClasesEstimadasComponent } from './components/modals/clases-estimadas/clases-estimadas.component';
import { ClasesEstimadasDetalleComponent } from './components/modals/clases-estimadas-detalle/clases-estimadas-detalle.component';
import { GestionCursoComponent } from './components/gestion-curso/gestion-curso.component';
import { GestionInstructorComponent } from './components/gestion-instructor/gestion-instructor.component';
import { GestionAlumnoComponent } from './components/gestion-alumno/gestion-alumno.component';
import { AbmAlumnoComponent } from './components/abm-alumno/abm-alumno.component';
import { AbmInstructorComponent } from './components/abm-instructor/abm-instructor.component';
import { AbmCursoComponent } from './components/abm-curso/abm-curso.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SeleccionarItemCursoComponent } from './components/modals/seleccionar-item-curso/seleccionar-item-curso.component';
import { SuspenderClaseComponent } from './components/modals/suspender-clase/suspender-clase.component';

@NgModule({
  declarations: [
    AgendaMovilComponent,
    AgendaInstructorComponent,
    AgendaCursoComponent,
    AltaAlumnoComponent,
    FacturaRutComponent,
    InscripcionCursoComponent,
    PedirCantidadClasesComponent,
    SeleccionarAccionAgendaComponent,
    SeleccionarAlumnoComponent,
    SeleccionarCursoComponent,
    SeleccionarFechaComponent,
    SeleccionarInstructorComponent,
    SeleccionarItemsFacturarComponent,
    NavComponent,
    AgendarClaseComponent,
    SeleccionarSocioComponent,
    ClasesEstimadasComponent,
    ClasesEstimadasDetalleComponent,
    GestionCursoComponent,
    GestionInstructorComponent,
    GestionAlumnoComponent,
    AbmAlumnoComponent,
    AbmInstructorComponent,
    AbmCursoComponent,
    SeleccionarItemCursoComponent,
    SuspenderClaseComponent
  ],
  imports: [
    CommonModule,
    EscuelaRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    SweetAlert2Module,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-UY' }
  ]
})
export class EscuelaModule { }
