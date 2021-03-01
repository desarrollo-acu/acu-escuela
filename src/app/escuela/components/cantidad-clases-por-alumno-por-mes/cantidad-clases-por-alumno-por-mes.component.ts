import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReportesService } from '@core/services/reportes.service';
import { openSamePDF } from '@utils/utils-functions';
import { downloadFile, downloadFileFromBase64 } from '../../../utils/utils-functions';

@Component({
  selector: 'app-cantidad-clases-por-alumno-por-mes',
  templateUrl: './cantidad-clases-por-alumno-por-mes.component.html',
  styleUrls: ['./cantidad-clases-por-alumno-por-mes.component.scss']
})
export class CantidadClasesPorAlumnoPorMesComponent implements OnInit {
  form: FormGroup;

  get fechaDesde() { return this.form.get('fechaDesde');  }
  get fechaHasta() { return this.form.get('fechaHasta');  }

  constructor(
    private reportesService: ReportesService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.fb.group({
      fechaDesde: ['',Validators.required],
      fechaHasta: ['',Validators.required],
    });
  }


  generarReporte(e: Event) {
    e.preventDefault();

    const {fechaDesde, fechaHasta} = this.form.value;
    console.log(this.form.value);

    this.reportesService.alumnosEnCurso(fechaDesde, fechaHasta).subscribe(({ dataBase64, filename}: any) => downloadFileFromBase64(dataBase64, filename));



  }

}
