import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GenerarExamenComponent } from '../generar-examen/generar-examen.component';
import { Movil } from '@core/model/movil.model';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';

@Component({
  selector: 'app-seleccionar-movil',
  templateUrl: './seleccionar-movil.component.html',
  styleUrls: ['./seleccionar-movil.component.scss'],
})
export class SeleccionarMovilComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'escMovCod', 'estado'];
  dataSource: MatTableDataSource<Movil>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<GenerarExamenComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const moviles = this.data.moviles;

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(moviles);
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

  getEstado(estado: string) {
    return estado === 'A' ? 'Activo' : 'Baja';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
