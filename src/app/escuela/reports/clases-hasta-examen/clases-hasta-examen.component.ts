import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meses } from '@core/model/meses.enum';
import { ReportesService } from '@core/services/reportes.service';
import {
  downloadFileFromBase64,
  getNumeroFromMes,
} from '@utils/utils-functions';
import * as moment from 'moment';

@Component({
  selector: 'app-clases-hasta-examen',
  templateUrl: './clases-hasta-examen.component.html',
  styleUrls: ['./clases-hasta-examen.component.scss'],
})
export class ClasesHastaExamenComponent implements OnInit {
  form: FormGroup;
  anios: number[] = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
  meses = Object.keys(Meses);
  get mes() {
    return this.form.get('mes');
  }
  get anio() {
    return this.form.get('anio');
  }
  constructor(
    private reportesService: ReportesService,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }
  private buildForm() {
    this.form = this.fb.group({
      mes: ['', Validators.required],
      anio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const posicion = this.anios.indexOf(currentYear);
    this.form.patchValue({
      anio: this.anios[posicion],
    });
  }
  generarReporte(e: Event) {
    e.preventDefault();

    const { mes, anio } = this.form.value;
    const mesNumero = getNumeroFromMes(mes);
    const usrId = localStorage.getItem('usrId');

    this.reportesService
      .getExcelClasesHastaExamen(mesNumero, anio)
      .subscribe((file: any) => {
        downloadFileFromBase64(file, `examenes-${mes}-${anio}.xlsx`);
      });
  }
}
