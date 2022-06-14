import { Component, OnInit } from '@angular/core';
import { Actions } from '@core/model/actions.model';
import { FormulariosService } from '@core/services/formularios.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';
import * as moment from 'moment';
import { ResultadoExamenPractico } from '../../../core/model/formularios/resultado-examen-practico.model';

@Component({
  selector: 'app-resultado-examen-practico',
  templateUrl: './resultado-examen-practico.component.html',
  styleUrls: ['./resultado-examen-practico.component.scss'],
})
export class ResultadoExamenPracticoComponent implements OnInit {
  formularios: ResultadoExamenPractico[] = [];
  exportData: ResultadoExamenPractico[] = [];
  columnas = ['instructor', 'alumno', 'resultado'];

  exportarExcel = () => {
    this.formulariosService
      .getExcelResultadoExamenPractico(this.exportData.map((f) => f.id))
      .subscribe(({ file }: any) =>
        downloadFileFromBase64(
          file,
          `resultado-examen-practico-${moment().toLocaleString()}.xlsx`
        )
      );
  };

  actionsHeader: Actions[] = [
    {
      title: 'Exportar a excel',
      callback: this.exportarExcel,
    },
  ];

  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.formulariosService.formularios$.subscribe(
      ({ resultadoExamenPractico }) => {
        this.formularios = resultadoExamenPractico;
        this.exportData = resultadoExamenPractico;
      }
    );
    this.formulariosService
      .getResultadoExamenPractico()
      .subscribe((formularios) =>
        this.formulariosService.setFormularios(
          'resultadoExamenPractico',
          formularios
        )
      );
  }

  changeData(formularios) {
    this.exportData = formularios;
  }
}
