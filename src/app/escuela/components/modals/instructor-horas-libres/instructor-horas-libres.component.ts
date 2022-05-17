import { filter } from 'rxjs/operators';
import { ClaseEstimadaDetalleParaSuspension } from './../../../../core/model/clase-estimada.model';
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
import { AlumnoService } from '@core/services/alumno.service';

@Component({
  selector: 'app-instructor-horas-libres',
  templateUrl: './instructor-horas-libres.component.html',
  styleUrls: ['./instructor-horas-libres.component.scss'],
})
export class InstructorHorasLibresComponent implements OnInit {
  displayedColumns: string[] = [
    'actions',
    'Fecha',
    'HoraInicio',
    'HoraFin',
    'DiaAsignado',
  ];
  dataSource: MatTableDataSource<ClaseEstimadaDetalleParaSuspension>;

  alumno: string;
  detalle: ClaseEstimadaDetalleParaSuspension[];
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
    //this.detalle[0].diaYaAsignado=true;

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
          this.data.clasesEstimadas.detalle
        );
        this.dataSource = new MatTableDataSource(this.detalle);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.log('error');
      },
    });
    // Assign the data to the data source for the table to render
    //this.dataSource = new MatTableDataSource(this.data.clasesEstimadas.detalle);
  }

  ngOnInit() {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fechaDiaAsignado(data1, data2) {
    for (let i = 0; i < data1.length; i++) {
      for (let x = 0; x < data2.length; x++) {
        if (data1[i].Fecha === data2[x].Fecha) {
          this.detalle[x].diaYaAsignado = true;
        }
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
