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
import { ClasesEstimadasDetalleComponent } from '../clases-estimadas-detalle/clases-estimadas-detalle.component';

import {
  ClaseEstimada,
  ClaseEstimadaDetalle,
} from '@core/model/clase-estimada.model';
import { openSamePDF } from '../../../../utils/utils-functions';
import { ReportesService } from '@core/services/reportes.service';

@Component({
  selector: 'app-clases-estimadas',
  templateUrl: './clases-estimadas.component.html',
  styleUrls: ['./clases-estimadas.component.scss'],
})
export class ClasesEstimadasComponent implements OnInit {
  displayedColumns: string[] = [
    'EscInsId',
    'EscInsNom',
    'FechaInicio',
    'FechaFin',
    'detalle',
  ];
  dataSource: MatTableDataSource<ClaseEstimada>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog,
    private reportesService: ReportesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(
      this.data.clasesEstimadas.ClasesEstimadas
    );
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

  verPDF(claseEstimada: ClaseEstimada) {
    this.reportesService
      .getPDFPlanDeClases(claseEstimada)
      .subscribe((pdf: any) => {
        openSamePDF(pdf, 'PlanDeClases');
      });
  }

  verDetalle(detalle: ClaseEstimadaDetalle[]) {
    const clasesEstimadasDialogRef = this.dialog.open(
      ClasesEstimadasDetalleComponent,
      {
        height: 'auto',
        width: '700px',
        data: {
          detalle,
        },
      }
    );
  }

  seleccionarEstimacion(claseEstimada: ClaseEstimada) {
    this.dialogRef.close({
      salir: false,
      continuar: true,
      claseEstimada,
    });
  }

  onSalir(): void {
    this.dialogRef.close({
      salir: true,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
