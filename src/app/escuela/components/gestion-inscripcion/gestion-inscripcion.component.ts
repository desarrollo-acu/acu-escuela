import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InscripcionService } from '@core/services/inscripcion.service';
import { Inscripcion } from '@core/model/inscripcion.model';
import { Router } from '@angular/router';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';
import { MatDialog } from '@angular/material/dialog';
import { GenerarNuevoPlanClasesComponent } from '../../dialogs/generar-nuevo-plan-clases/generar-nuevo-plan-clases.component';
import { AcuService } from '../../../core/services/acu.service';


@Component({
  selector: 'app-gestion-inscripcion',
  templateUrl: './gestion-inscripcion.component.html',
  styleUrls: ['./gestion-inscripcion.component.scss']
})
export class GestionInscripcionComponent implements OnInit {

  displayedColumns: string[] = ['actions', 'Alumno', 'Instructor', 'Curso', 'FechaInscripcion', 'FechaInicio'];

  dataSource: MatTableDataSource<Inscripcion>;
  verInscripciones: boolean;
  filtro: string;


  // Test paginator
  pageEvent: PageEvent;
  pageIndex: number;
  pageSize = 5;
  length: number;
  cantidad = 60000;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private inscripcionService: InscripcionService,
    private acuService: AcuService,
    public dialog: MatDialog,
    private router: Router) {
    console.log('constructor gestion-inscripcion');


  }

  ngOnInit() {
    console.log('ngoninit gestion-inscripcion');
    const event = this.ejecutoEvent(null);


    // Get the input box
    const input = document.getElementById('search');

    // Init a timeout variable to be used below
    let timeout = null;

    // Listen for keystroke events
    input.addEventListener('keyup', (e) => {
      // Clear the timeout if it has already been set.
      // This will prevent the previous task from executing
      // if it has been less than <MILLISECONDS>
      clearTimeout(timeout);

      // Make a new timeout set to go off in 1000ms (1 second)
      timeout = setTimeout(() => {

        this.getInscripciones(this.pageSize, 1, this.filtro);
      }, 500);
    });

  }

  verDetalle(inscripcion: Inscripcion) {

    this.inscripcionService.sendDataInscripcion(inscripcion, 0);
    this.router.navigate(['/escuela/abm-inscripcion']);
  }


  getInscripciones(pageSize, pageNumber, filtro) {


    if (pageNumber === 0) {
      pageNumber = 1;
    }
    this.verInscripciones = false;
    this.inscripcionService.obtenerInscripciones(pageSize, pageNumber, filtro)
      .subscribe((res: any) => {

        console.log('getInscripciones : ', res);
        this.length = res.Cantidad;
        this.actualizarDatasource(res, pageSize, pageNumber - 1);


      });
  }

  ejecutoEvent(pageEvento: PageEvent) {
    this.pageEvent = pageEvento;
    const filter = (this.filtro) ? this.filtro : '';
    console.log(`ejecuto Event: ${pageEvento}`);

    if (pageEvento) {
      console.log(` 1) ejecuto Event: ${pageEvento}`);
      let index = pageEvento.pageIndex;
      this.pageSize = pageEvento.pageSize;
      index += 1;
      // Si estoy retrocediendo saco 1 del index
      if (pageEvento.previousPageIndex > pageEvento.pageIndex) {
        index -= 1;
      }

      this.getInscripciones(pageEvento.pageSize, index, filter);

    } else {
      console.log(` 2) ejecuto Event: ${pageEvento}`);
      this.getInscripciones(this.pageSize, 1, '');

    }
    return pageEvento;

  }

  actualizarDatasource(data, size?, index?) {
    console.log('Inscripciones: ', data);
    console.log('Inscripciones: ', data.Inscripciones);
    const inscripciones: Inscripcion[] = data.Inscripciones;
    console.log('2 Inscripciones: ', inscripciones);
    this.dataSource = data.Inscripciones;
    this.verInscripciones = true;

    if (size) {
      this.pageSize = size;
    }

    this.length = data.Cantidad;

    if (index) {
      this.pageIndex = index;
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


  }

  nuevoPlanClase({ EscAluCurId, AluId, TipCurId }: Inscripcion){
    console.log( EscAluCurId, AluId, TipCurId );
    this.inscripcionService.obtenerInscripcionById( EscAluCurId, AluId, TipCurId ).subscribe( inscripcion => {
      const dialogRef = this.dialog.open(GenerarNuevoPlanClasesComponent, {
        data: {
           inscripcion
        }
      });

      dialogRef.afterClosed().subscribe(result => {
       console.log(result);

      });

    });


  }

}
