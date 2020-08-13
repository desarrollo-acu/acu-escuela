import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GestionAlumnoComponent } from '../../gestion-alumno/gestion-alumno.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgendaClase } from '@core/model/agenda-clase.model';
import { DisponibilidadAlumnoComponent } from '../disponibilidad-alumno/disponibilidad-alumno.component';
import { AcuService } from '@core/services/acu.service';
import { openSamePDF } from '@utils/utils-functions';

@Component({
  selector: 'app-inscripciones-alumno',
  templateUrl: './inscripciones-alumno.component.html',
  styleUrls: ['./inscripciones-alumno.component.scss']
})
export class InscripcionesAlumnoComponent implements OnInit {
  alumno: string;
  displayedColumns: string[] = ['actions', 'TipCurId', 'EscInsId', 'FechaInscripcion', 'detalle'];
  dataSource: MatTableDataSource<AgendaClase>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(
    public dialogRef: MatDialogRef<GestionAlumnoComponent>,
    public dialog: MatDialog,
    private acuService: AcuService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.alumno = this.data.alumno;

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data.inscripciones);

  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  verDisponibilidad(inscripcion: AgendaClase) {

    console.log('inscripcion: ', inscripcion);

    const disponibilidadDialogRef = this.dialog.open(DisponibilidadAlumnoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        inscripcion,
      }
    });

    disponibilidadDialogRef.afterClosed().subscribe(result => {
      console.log('result: ', result);

    });
  }

  verPlanDeClases(inscripcion: AgendaClase) {
    console.log('inscripcion: ', inscripcion);

    this.acuService.getPDFPlanDeClases(inscripcion.planDeClases).subscribe(pdf => {
      openSamePDF(pdf, 'PlanDeClases');
    });


  }
}
