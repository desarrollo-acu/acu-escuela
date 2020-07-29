import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { InscripcionCursoComponent } from '../modals/inscripcion-curso/inscripcion-curso.component';
import { MatDialog } from '@angular/material/dialog';
import { formatDateToString } from '@utils/utils-functions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from({ length: 50 }, () =>
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  private mobileQueryListener: () => void;

  title: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    public dialog: MatDialog) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this.mobileQueryListener);

    console.log('url: ', this.router.url);
    this.changeTitle(this.router.url);

  }


  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  inscripcion() {
    const fecha = new Date();
    const fechaClase = formatDateToString(fecha);
    const dialogRef = this.dialog.open(InscripcionCursoComponent, {
      data: {
        inscripcionCurso: {
          TrnMode: '',
          FechaClase: fechaClase,
          Hora: 0,
          EscInsId: '',
          EscInsNom: '',
          TipCurId: 0,
          TipCurNom: '',
          EscAgeInsObservaciones: '',
          mensaje: 'string'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('cierro y recargo la agenda, result: ', result);
      if (result) {

        // Ir a gestionar inscripciones.
        this.changeTitle('/escuela/gestion-inscripcion');
        this.router.navigate(['/escuela/gestion-inscripcion']);
      }
    });

  }

  changeTitle(title: string) {
    switch (title) {

      case '/escuela/agenda-movil':
        this.title = 'Agenda de moviles';
        break;

      case '/escuela/agenda-instructor':
        this.title = 'Agenda de instructores';
        break;

      case '/escuela/gestion-inscripcion':
      case '/escuela/abm-inscripcion':
        this.title = 'Gestión de inscripciones';
        break;

      case '/escuela/gestion-instructor':
      case '/escuela/abm-instructor':
        this.title = 'Gestión de instructores';
        break;

      case '/escuela/gestion-curso':
      case '/escuela/abm-curso':
        this.title = 'Gestión de cursos';
        break;

      case '/escuela/gestion-alumno':
      case '/escuela/abm-alumno':
        this.title = 'Gestión de alumnos';
        break;


      default:
        break;
    }
  }
}
