import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportesService } from '@core/services/reportes.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';

@Component({
  selector: 'app-alumnos-pendientes-de-pago',
  templateUrl: './alumnos-pendientes-de-pago.component.html',
  styleUrls: ['./alumnos-pendientes-de-pago.component.scss']
})
export class AlumnosPendientesDePagoComponent  {
  form: FormGroup;

  get fechaDesde() {
    return this.form.get('fechaDesde');
  }
  get fechaHasta() {
    return this.form.get('fechaHasta');
  }

  constructor(
    private reportesService: ReportesService,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      fechaDesde: ['', Validators.required],
      fechaHasta: ['', Validators.required],
    });
  }

  generarReporte(e: Event) {
    e.preventDefault();

    const { fechaDesde, fechaHasta } = this.form.value;

    this.reportesService
      .alumnosPendientesDePago(fechaDesde, fechaHasta)
      .subscribe(({ dataBase64, filename }: any) =>
        downloadFileFromBase64(dataBase64, filename)
      );
  }
}
