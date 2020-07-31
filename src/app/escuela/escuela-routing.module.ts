import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { AgendaInstructorComponent } from './components/agenda-instructor/agenda-instructor.component';
import { SeleccionarAlumnoComponent } from './components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { AgendaMovilComponent } from './components/agenda-movil/agenda-movil.component';
import { AgendarClaseComponent } from './components/modals/agendar-clase/agendar-clase.component';
import { GestionCursoComponent } from './components/gestion-curso/gestion-curso.component';
import { GestionInstructorComponent } from './components/gestion-instructor/gestion-instructor.component';
import { GestionAlumnoComponent } from './components/gestion-alumno/gestion-alumno.component';
import { AbmCursoComponent } from './components/abm-curso/abm-curso.component';
import { AbmAlumnoComponent } from './components/abm-alumno/abm-alumno.component';
import { AbmInstructorComponent } from './components/abm-instructor/abm-instructor.component';
import { GestionInscripcionComponent } from './components/gestion-inscripcion/gestion-inscripcion.component';
import { AbmInscripcionComponent } from './components/abm-inscripcion/abm-inscripcion.component';




const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      {
        path: 'agenda-movil',
        component: AgendaMovilComponent
      },
      {
        path: 'agenda-instructor',
        component: AgendaInstructorComponent
      },
      {
        path: 'gestion-inscripcion',
        component: GestionInscripcionComponent
      },
      {
        path: 'gestion-curso',
        component: GestionCursoComponent
        //GestionCursoComponent
      },
      {
        path: 'gestion-alumno',
        component: GestionAlumnoComponent
      },
      {
        path: 'gestion-instructor',
        component: GestionInstructorComponent
      },
      {
        path: 'abm-inscripcion',
        component: AbmInscripcionComponent

      },
      {
        path: 'abm-curso',
        component: AbmCursoComponent

      },
      {
        path: 'abm-alumno',
        component: AbmAlumnoComponent
      },
      {
        path: 'abm-instructor',
        component: AbmInstructorComponent
      },
      {
        path: 'agendaclase',
        component: AgendarClaseComponent
      },
      {
        path: 'seleccionarAlumno',
        component: SeleccionarAlumnoComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscuelaRoutingModule { }
