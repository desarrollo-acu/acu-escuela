import { ClaseEstimada } from './../../../../core/model/clase-estimada.model';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { AcuService } from '@core/services/acu.service';
import { InscripcionCursoComponent } from '../inscripcion-curso/inscripcion-curso.component';

import { ClaseEstimadaDetalle } from '@core/model/clase-estimada.model';

@Component({
  selector: 'app-clases-estimadas-detalle',
  templateUrl: './clases-estimadas-detalle.component.html',
  styleUrls: ['./clases-estimadas-detalle.component.scss'],
})
export class ClasesEstimadasDetalleComponent implements OnInit {
  displayedColumns: string[] = ['Fecha', 'HoraInicio', 'HoraFin'];
  dataSource: MatTableDataSource<ClaseEstimadaDetalle>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Assign the data to the data source for the table to render
    console.log(this.data.detalles);

    this.dataSource = new MatTableDataSource(this.data.detalles);
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
    this.dialogRef.close();
  }
}
