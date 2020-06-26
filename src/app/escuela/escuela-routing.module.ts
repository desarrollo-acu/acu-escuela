import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { AgendaInstructorComponent } from './components/agenda-instructor/agenda-instructor.component';
import { SeleccionarAlumnoComponent } from './components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { AgendaMovilComponent } from './components/agenda-movil/agenda-movil.component';
import { AgendarClaseComponent } from './components/modals/agendar-clase/agendar-clase.component';



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
