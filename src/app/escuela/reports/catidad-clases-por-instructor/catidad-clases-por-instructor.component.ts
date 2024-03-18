import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportesService } from '@core/services/reportes.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';

@Component({
  selector: 'app-catidad-clases-por-instructor',
  templateUrl: './catidad-clases-por-instructor.component.html',
  styleUrls: ['./catidad-clases-por-instructor.component.scss'],
})
export class CatidadClasesPorInstructorComponent implements OnInit {
  form: FormGroup;

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
    console.log(this.fechaDesde);
    this.reportesService
      .getReporteClasesPorInstructors(this.fechaDesde, this.fechaHasta)
      .subscribe((dataBase64: any) =>
        downloadFileFromBase64(dataBase64, 'CantClasesPorInstructor.xlsx')
      );
  }
  ngOnInit(): void {}
  get fechaDesde() {
    const res = this.form.get('fechaDesde')?.value
      ? this.form.get('fechaDesde')?.value
      : '';
    return res;
  }
  get fechaHasta() {
    const res = this.form.get('fechaHasta')?.value
      ? this.form.get('fechaHasta')?.value
      : '';
    return res;
  }
}
