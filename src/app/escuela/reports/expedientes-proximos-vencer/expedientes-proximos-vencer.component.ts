import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Alumno } from '@core/model/alumno.model';
import { AlumnoService } from '@core/services/alumno.service';
import { ReportesService } from '@core/services/reportes.service';
import { SeleccionarAlumnoComponent } from '@escuela/components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { downloadFileFromBase64 } from '@utils/utils-functions';

@Component({
  selector: 'app-expedientes-proximos-vencer',
  templateUrl: './expedientes-proximos-vencer.component.html',
  styleUrls: ['./expedientes-proximos-vencer.component.scss'],
})
export class ExpedientesProximosVencerComponent implements OnInit {
  form: FormGroup;
  alumnoId: number;

  constructor(
    private reportesService: ReportesService,
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    public dialog: MatDialog
  ) {
    this.buildForm();

    this.form.controls.alumno.disable();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.fb.group({
      fechaDesde: ['', Validators.required],
      fechaHasta: ['', Validators.required],
      alumno: [''],
    });
  }

  generarReporte(e: Event) {
    e.preventDefault();
    const { fechaDesde, fechaHasta } = this.form.value; //getRawValue();

    this.reportesService
      .expedientesProximos_A_Vencer(fechaDesde, fechaHasta, this.alumnoId)
      .subscribe(({ dataBase64, filename }: any) =>
        downloadFileFromBase64(dataBase64, filename)
      );
  }

  seleccionarAlumno() {
    this.alumnoService
      .obtenerAlumnos(5, 1, '')
      .subscribe((res: any) =>
        this.openDialogAlumnos(res.alumnos, res.cantidad)
      );
  }
  private openDialogAlumnos(alumnos, cantidad) {
    const alumnosDialogRef = this.dialog.open(SeleccionarAlumnoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        alumnos,
        cantidad,
      },
    });
    alumnosDialogRef.afterClosed().subscribe((alumno: Alumno) => {
      if (alumno) {
        this.form.controls.alumno.setValue(alumno.AluNomComp);
        this.alumnoId = alumno.AluId;
      }
    });
  }

  get fechaDesde() {
    return this.form.get('fechaDesde');
  }
  get fechaHasta() {
    return this.form.get('fechaHasta');
  }
}
