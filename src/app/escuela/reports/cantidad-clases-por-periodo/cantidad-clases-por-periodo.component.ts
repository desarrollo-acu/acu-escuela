import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReportesService } from '@core/services/reportes.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';
import { Meses } from '../../../core/model/meses.enum';
import { getNumeroFromMes } from '../../../utils/utils-functions';

@Component({
  selector: 'app-cantidad-clases-por-periodo',
  templateUrl: './cantidad-clases-por-periodo.component.html',
  styleUrls: ['./cantidad-clases-por-periodo.component.scss']
})
export class CantidadClasesPorPeriodoComponent implements OnInit {
  form: FormGroup;

  meses =   Object.keys(Meses);
  get mes() { return this.form.get('mes');  }
  get anio() { return this.form.get('anio');  }

  constructor(
    private reportesService: ReportesService,
    private fb: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.fb.group({
      mes: ['',Validators.required],
      anio: ['',Validators.required],
    });
  }


  generarReporte(e: Event) {
    e.preventDefault();

    const {mes, anio} = this.form.value;
    const mesNumero = getNumeroFromMes(mes);
    const usrId = localStorage.getItem('usrId');

    this.reportesService.cantidadClasesPorPeriodo(usrId, mesNumero, anio).subscribe(({ dataBase64, filename}: any) => downloadFileFromBase64(dataBase64, filename));



  }



}
