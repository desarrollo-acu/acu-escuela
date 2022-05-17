import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(
    private reportesService: ReportesService,
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    public dialog: MatDialog
  ) {
    this.buildForm();

    this.form.controls.alumnoId.disable();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.fb.group({
      fechaDesde: ['', Validators.required],
      fechaHasta: ['', Validators.required],
      alumnoId: ['0'],
    });
  }

  generarReporte(e: Event) {
    e.preventDefault();
    const { fechaDesde, fechaHasta, alumnoId } = this.form.getRawValue();
    this.reportesService
      .expedientesProximos_A_Vencer(fechaDesde, fechaHasta, alumnoId)
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
    alumnosDialogRef.afterClosed().subscribe((alumno) => {
      if (alumno) {
        this.form.controls.alumnoId.setValue(alumno.AluId);
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
