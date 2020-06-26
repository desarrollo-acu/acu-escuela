import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgendarClaseComponent } from '../agendar-clase/agendar-clase.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { InscripcionCursoComponent } from '../inscripcion-curso/inscripcion-curso.component';
import { confirmacionUsuario } from '@utils/sweet-alert';

export interface FacturaItemData {
  TipCurId: number;
  EscItemCod: number;
  EscItemDesc: string;
  EscCurIteClaAdi: string;
}
@Component({
  selector: 'app-seleccionar-items-facturar',
  templateUrl: './seleccionar-items-facturar.component.html',
  styleUrls: ['./seleccionar-items-facturar.component.scss']
})
export class SeleccionarItemsFacturarComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'EscItemCod', 'EscItemDesc'];
  dataSource: MatTableDataSource<FacturaItemData>;

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
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log('this.data: ', this.data);


    this.filtro = this.data.filtro;

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data.items);

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }




  onNoClick(): void {

    confirmacionUsuario('Cancelar factura', 'Se cancelará el proceso de facturación. ¿Confirma continuar?').then(confirma => {
      console.log('confirma selectr item: ', confirma);

      if (confirma.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }


}
