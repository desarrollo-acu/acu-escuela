import { Component, OnInit, ViewChild, Inject, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AcuService } from 'src/app/core/services/acu.service';


export interface SocioData {
  SocId: string;
  Nombre: string;
  SocMes: string;
  SocNroCI: string;
  SocNroMat: string;
}

@Component({
  selector: 'app-seleccionar-socio',
  templateUrl: './seleccionar-socio.component.html',
  styleUrls: ['./seleccionar-socio.component.scss']
})
export class SeleccionarSocioComponent implements AfterViewInit, OnInit, AfterViewChecked {

  displayedColumns: string[] = ['actions', 'SocId', 'Nombre', 'SocMes', 'SocNroCI', 'SocNroMat'];
  dataSource: MatTableDataSource<SocioData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // MatPaginator Output
  pageEvent: PageEvent;

  // MatPaginator Inputs
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  cantidad = 60000;
  length: number;

  filtro: string;

  constructor(
    public dialogRef: MatDialogRef<any>,
    public dialog: MatDialog,
    private acuService: AcuService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    const socios = this.data.socios;

    this.filtro = this.data.filtro;
    this.cantidad = this.data.cantidad;
    this.actualizarDatasource(this.data.socios);
    this.length = this.cantidad;
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(socios);



  }
  ngAfterViewInit(): void {

    setTimeout(() => {
      this.dataSource.paginator.length = this.length;
      this.paginator.length = this.length;
    });
  }

  ngAfterViewChecked() {

    setTimeout(() => {

      this.paginator.length = this.length;
    });
  }

  ngOnInit() {
    this.ejecutoEvent(null);

    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.length = this.cantidad;
    this.dataSource.sort = this.sort;


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

        this.getSocios(1000, 1, this.filtro);
      }, 500);
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

      this.getSocios(pageEvento.pageSize, index, filter);
    }
    return pageEvento;

  }

  getSocios(pageSize, pageNumber, filtro) {
    if (pageNumber === 0) {
      pageNumber = 1;
    }

    this.acuService.getSocios(pageSize, pageNumber, 'FREE', filtro)
      .subscribe((res: any) => {

        this.length = res.Cantidad;
        this.actualizarDatasource(res.Socios, pageSize, pageNumber - 1);
      });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  actualizarDatasource(data, size?, index?) {

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    // this.dataSource.paginator.length = cantidad;
    this.dataSource.sort = this.sort;

    /*
    

    this.dataSource = data.Alumnos;
    // this.pageIndex =  pageIndex;
    if (size) {
      this.pageSize = size;
    }
    console.log('cantidad: ', data.Cantidad);

    this.length = data.Cantidad;
    console.log('this.length: ', this.length);

    // this.dataSource = new MatTableDataSource(data);
    if (index) {
      this.pageIndex = index;
    }
    this.dataSource.paginator = this.paginator;
    // this.dataSource.paginator.length = cantidad;
    this.dataSource.sort = this.sort;
    */
  }
}
