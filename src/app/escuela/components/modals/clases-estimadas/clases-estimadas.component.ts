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
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AcuService } from '@core/services/acu.service';
import { InscripcionCursoComponent } from '../inscripcion-curso/inscripcion-curso.component';
import { ClasesEstimadasDetalleComponent } from '../clases-estimadas-detalle/clases-estimadas-detalle.component';

import { ClaseEstimada, ClaseEstimadaDetalle } from '@core/model/clase-estimada.model';

@Component({
  selector: 'app-clases-estimadas',
  templateUrl: './clases-estimadas.component.html',
  styleUrls: ['./clases-estimadas.component.scss']
})
export class ClasesEstimadasComponent implements OnInit {

  displayedColumns: string[] = ['actions', 'EscInsId', 'EscInsNom', 'FechaInicio', 'FechaFin', 'detalle'];
  dataSource: MatTableDataSource<ClaseEstimada>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog,
    private acuService: AcuService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log('this.data.clasesEstimadas: ', this.data.clasesEstimadas);
    console.log('this.data.clasesEstimadas.EscInsId: ', this.data.clasesEstimadas.ClasesEstimadas);

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data.clasesEstimadas.ClasesEstimadas);
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
    console.log('claseEstimada: ', claseEstimada);

    this.acuService.getPDFPlanDeClases(claseEstimada).subscribe((pdf: any) => {

      this.acuService.openSamePDF(pdf, 'PlanDeClases');
      // this.acuService.getPDF(pdf, 'planDeClases');


    });

  }

  verDetalle(detalle: ClaseEstimadaDetalle[]) {
    console.log('detalle: ', detalle);


    const clasesEstimadasDialogRef = this.dialog.open(ClasesEstimadasDetalleComponent, {
      height: 'auto',
      width: '700px',
      data: {
        detalle
      }
    });


    clasesEstimadasDialogRef.afterClosed().subscribe((result: any) => {
      // this.alumno = result;
      console.log('1.response: ' + result);
      console.log('2.response: ' + JSON.stringify(result));
      console.log(`2. response ${result}`);




    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
