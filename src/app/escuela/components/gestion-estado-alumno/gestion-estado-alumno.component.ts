import { AlumnoCsharp } from './../../../core/model/alumnoCsharp.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlumnoService } from '@core/services/alumno.service';
import { Alumno } from '@core/model/alumno.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { downloadFileFromBase64 } from '@utils/utils-functions';
import * as moment from 'moment';

@Component({
  selector: 'app-gestion-estado-alumno',
  templateUrl: './gestion-estado-alumno.component.html',
  styleUrls: ['./gestion-estado-alumno.component.scss'],
})
export class GestionEstadoAlumnoComponent implements OnInit {
  displayedColumns: string[] = [
    'AluNro',
    'AluNom',
    'AluApe',
    'AluCI',
    'AluTel2',
    'AluMail',
    'EscInsId',
    'AluEst',
    'inscripciones',
  ];

  dataSource: MatTableDataSource<Alumno>;
  verAlumnos: boolean;
  filtro: string = '';

  pageEvent: PageEvent;
  pageIndex: number;
  pageSize = environment.pageSize;
  length: number;
  cantidad = 60000;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private alumnoService: AlumnoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
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
        this.getAlumnos(this.pageSize, 1, this.filtro);
      }, 500);
    });
  }

  getAlumnos(pageSize, pageNumber, filtro) {
    if (pageNumber === 0) {
      pageNumber = 1;
    }
    this.verAlumnos = false;
    this.alumnoService
      .obtenerAlumnosReprobadosBackendCsharp(pageSize, pageNumber, filtro)
      .subscribe((res: any) => {
        this.length = res.cantidad;
        this.actualizarDatasource(res, pageSize, pageNumber - 1);
      });
  }

  ejecutoEvent(pageEvento: PageEvent) {
    this.pageEvent = pageEvento;
    const filter = this.filtro ? this.filtro : '';

    if (pageEvento) {
      let index = pageEvento.pageIndex;
      this.pageSize = pageEvento.pageSize;
      index += 1;
      // Si estoy retrocediendo saco 1 del index
      if (pageEvento.previousPageIndex > pageEvento.pageIndex) {
        index -= 1;
      }

      this.getAlumnos(pageEvento.pageSize, index, filter);
    } else {
      this.getAlumnos(this.pageSize, 1, '');
    }
    return pageEvento;
  }

  cambiarEstado(alumno: AlumnoCsharp) {
    Swal.fire({
      title: `¿Desea cambiar el estado del alumno ${alumno.alunro} a Inactivo?`,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.alumnoService
          .modificarEstadoAlumno(alumno.alunro.toString(), 'I')
          .subscribe((res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'El estado fue cambiado',
              showConfirmButton: false,
              timer: 1500,
            }).then((r) => {
              window.location.reload();
            });
          });
      }
    });
  }

  getExcel() {
    this.alumnoService
      .obtenerExcelAlumnosReprobadosBackendCsharp()
      .subscribe((file: any) => {
        downloadFileFromBase64(
          file,
          `alumnos-${moment().format('DD-MM-yyyy')}.xlsx`
        );
      });
  }
  actualizarDatasource(data, size?, index?) {
    this.dataSource = data.alumnos;

    this.verAlumnos = true;

    if (size) {
      this.pageSize = size;
    }

    this.length = data.cantidad;

    if (index) {
      this.pageIndex = index;
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
