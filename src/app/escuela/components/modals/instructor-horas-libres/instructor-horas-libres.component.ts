import {
  ClaseEstimada,
  ClaseEstimadaDetalle,
} from './../../../../core/model/clase-estimada.model';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

import { InscripcionCursoComponent } from '../inscripcion-curso/inscripcion-curso.component';

import { AlumnoService } from '@core/services/alumno.service';
import * as moment from 'moment';

@Component({
  selector: 'app-instructor-horas-libres',
  templateUrl: './instructor-horas-libres.component.html',
  styleUrls: ['./instructor-horas-libres.component.scss'],
})
export class InstructorHorasLibresComponent implements OnInit {
  displayedColumns: string[] = [
    'actions',
    'Fecha',
    'DiaFecha',
    'HoraInicio',
    'HoraFin',
    'DiaAsignado',
  ];
  dataSource: MatTableDataSource<ClaseEstimadaDetalle>;

  alumno: string;
  detalle: ClaseEstimadaDetalle[];
  titulo: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog,
    private alumnoService: AlumnoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.detalle = this.data.clasesEstimadas.detalle;

    this.alumno = this.data.alumno ? this.data.alumno : '';

    this.titulo = this.data.alumno
      ? `Seleccionar hora libre para: ${this.data.alumno}. `
      : '';
    this.titulo += `Próximas horas libres de: ${this.data.clasesEstimadas.instructorCodigo} -
    ${this.data.clasesEstimadas.instructorNombre}`;

    this.alumnoService.getClasesByAlumno(this.data.alumId).subscribe({
      next: (response: any) => {
        this.fechaDiaAsignado(
          response.ClasesEstimadas.Detalle,
          this.data.clasesEstimadas.detalle,
          response.FechaExamen
        );

        this.dataSource = new MatTableDataSource(this.detalle);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.log('error');
      },
    });
  }

  ngOnInit() {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Recibos las fechas disponibles del alumno, las fechas que el alumno tiene agendada clases,
  //y la fecha del examen. Cuando exista una coincidencia de fecha cargo en true diaUaAsignado
  //este campo me permite indicar en la tabla aquel día disponible que ya tenga una clase.
  //La fecha del examen me indica hasta que rango de fechas mostrar (menor a la fecha de examen)
  fechaDiaAsignado(
    fechasConClaseAlumno,
    fechasDisponiblesInstructor,
    fechaExamenAlumno
  ) {
    for (let i = 0; i < fechasConClaseAlumno.length; i++) {
      for (let x = 0; x < fechasDisponiblesInstructor.length; x++) {
        if (
          moment(fechasConClaseAlumno[i].Fecha).isSame(
            moment(fechasDisponiblesInstructor[x].Fecha)
          )
        ) {
          this.detalle[x].diaYaAsignado = true;
        }
      }
    }
    const fechaExamenAlumnoMoment = moment(fechaExamenAlumno);
    if (fechaExamenAlumnoMoment.isValid()) {
      //Filtro las fechas anteriores al día del examen.
      this.detalle = this.detalle.filter((e) =>
        this.filtrarFechaIgualOAnterior(fechaExamenAlumnoMoment, e.Fecha)
      );
    }
  }

  filtrarFechaIgualOAnterior(fechaExamenAlumno, fechaDisponibleInstructor) {
    fechaExamenAlumno = moment(fechaExamenAlumno);
    fechaDisponibleInstructor = moment(fechaDisponibleInstructor);
    return fechaExamenAlumno.isSameOrAfter(fechaDisponibleInstructor);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
