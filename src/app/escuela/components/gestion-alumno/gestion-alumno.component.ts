import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AcuService } from '@core/services/acu.service';
import { Alumno } from '@core/model/alumno.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-alumno',
  templateUrl: './gestion-alumno.component.html',
  styleUrls: ['./gestion-alumno.component.scss']
})
export class GestionAlumnoComponent implements OnInit {

  displayedColumns: string[] = ['actions', 'AluNro', 'AluNomComp', 'AluCI'];

  dataSource: MatTableDataSource<Alumno>;
  verAlumnos: boolean;
  filtro: string;


  // Test paginator
  pageEvent: PageEvent;
  pageIndex: number;
  pageSize: number;
  length: number;
  cantidad = 60000;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private acuService: AcuService,
    private router: Router) {

  }

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

        console.log('3) Input Value:', this.filtro);
        console.log('3) Input this.pageSize:', this.pageSize);

        this.getAlumnos(this.pageSize, 1, this.filtro);
      }, 500);
    });

  }

  abmAlumno(modo: string, alumno: Alumno) {
    if (modo === 'INS') {

      this.acuService.getAlumnoNumero().subscribe((res: { numero: number }) => {
        console.log('res: ', res);


        this.acuService.sendDataAlumno(modo, alumno, res.numero);
        this.router.navigate(['/escuela/abm-alumno']);



      });

    } else {

      this.acuService.sendDataAlumno(modo, alumno);
      this.router.navigate(['/escuela/abm-alumno']);

    }


  }

  getAlumnos(pageSize, pageNumber, filtro) {
    console.log('4) filtro: ', filtro);
    console.log('4) pageSize: ', pageSize);


    if (pageNumber === 0) {
      pageNumber = 1;
    }
    this.verAlumnos = false;
    this.acuService.obtenerAlumnos(pageSize, pageNumber, filtro)
      .subscribe((res: any) => {
        console.log('res: ', res);
        console.log('5) filtro: ', filtro);
        // this.pageEvent.length = res.Cantidad;

        this.length = res.Cantidad;
        this.actualizarDatasource(res, pageSize, pageNumber - 1);


      });
  }

  ejecutoEvent(pageEvento: PageEvent) {
    this.pageEvent = pageEvento;
    const filter = (this.filtro) ? this.filtro : '';

    console.log('ejecutoEvent, pageEvento: ', pageEvento);
    if (pageEvento) {
      let index = pageEvento.pageIndex;
      this.pageSize = pageEvento.pageSize;
      index += 1;
      // Si estoy retrocediendo saco 1 del index
      if (pageEvento.previousPageIndex > pageEvento.pageIndex) {
        index -= 1;
      }
      console.log('index: ', index);

      this.getAlumnos(pageEvento.pageSize, index, filter);
      // } else {
      //   this.getAlumnos(1000, 1, this.filtro);

    } else {
      this.getAlumnos(5, 1, '');

    }
    return pageEvento;

  }

  actualizarDatasource(data, size?, index?) {

    this.dataSource = data.Alumnos;
    this.verAlumnos = true;
    // this.pageIndex =  pageIndex;
    if (size) {
      this.pageSize = size;
    }
    console.log('cantidad: ', data.Cantidad);

    this.length = data.Cantidad;
    console.log('this.length: ', this.length);

    if (index) {
      this.pageIndex = index;
    }
    this.dataSource.paginator = this.paginator;
    // this.dataSource.paginator.length = cantidad;
    this.dataSource.sort = this.sort;


    // this.dataSource.paginator = this.paginator;
    // this.dataSource.paginator.length = this.cantidad;
    // this.dataSource.sort = this.sort;
  }

}
