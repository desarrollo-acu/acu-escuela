import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgendaClase } from '@core/model/agenda-clase.model';
import { Alumno } from '@core/model/alumno.model';
import { ClaseSuspendida } from '@core/model/clase-suspendida-alumno.interface';
import { Inscripcion } from '@core/model/inscripcion.model';
import { AlumnoService } from '@core/services/alumno.service';
import { InscripcionService } from '@core/services/inscripcion.service';
import { ReportesService } from '@core/services/reportes.service';
import { GestionAlumnoComponent } from '@escuela/components/gestion-alumno/gestion-alumno.component';
import { DisponibilidadAlumnoComponent } from '@escuela/components/modals/disponibilidad-alumno/disponibilidad-alumno.component';
import { openSamePDF } from '@utils/utils-functions';
import { GenerarNuevoPlanClasesComponent } from '../generar-nuevo-plan-clases/generar-nuevo-plan-clases.component';

interface Data {
  alumno: Alumno;
  clasesSuspendidas: ClaseSuspendida[];
}

@Component({
  selector: 'app-reanudar-clases-suspendidas',
  templateUrl: './reanudar-clases-suspendidas.component.html',
  styleUrls: ['./reanudar-clases-suspendidas.component.scss'],
})
export class ReanudarClasesSuspendidasComponent implements OnInit {
  alumno: Alumno;
  displayedColumns: string[] = [
    'actions',
    'fecha',
    'curso',
    'cantidad',
    'usuario',
  ];
  dataSource: MatTableDataSource<ClaseSuspendida>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private inscripcionService: InscripcionService,
    private alumnoService: AlumnoService,
    public dialogRef: MatDialogRef<GestionAlumnoComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {
    const { alumno, clasesSuspendidas } = this.data;
    this.alumno = alumno;
    this.dataSource = new MatTableDataSource(clasesSuspendidas);
  }

  ngOnInit(): void {
    this.setPaginatorAndSort();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  reanudarClases({
    escAluCurId,
    aluId,
    tipCurId,
    cantidad,
    fecha,
  }: ClaseSuspendida) {
    this.inscripcionService
      .obtenerInscripcionById(escAluCurId, aluId, tipCurId)
      .subscribe((inscripcion) => {
        const ref = this.dialog.open(GenerarNuevoPlanClasesComponent, {
          data: {
            inscripcion,
            cantidadClases: cantidad,
          },
        });
        ref.afterClosed().subscribe((reagendoClase) => {
          if (reagendoClase) {
            this.alumnoService
              .setClasesRestauradas(aluId, fecha, tipCurId)
              .subscribe((isOk) => isOk && this.getClasesSuspendidas(aluId));
          }
        });
      });
  }

  getClasesSuspendidas(aluId: number) {
    this.alumnoService
      .getClasesSuspendidasByAlumno(aluId)
      .subscribe((clasesSuspendidas) => {
        if (clasesSuspendidas.length === 0) return this.dialogRef.close();
        this.dataSource = new MatTableDataSource(clasesSuspendidas);
        this.setPaginatorAndSort();
      });
  }

  setPaginatorAndSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
