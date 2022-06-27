import { Component, OnInit } from '@angular/core';
import { Actions } from '@core/model/actions.model';
import { FormulariosService } from '@core/services/formularios.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';
import * as moment from 'moment';
import { DiarioMovil } from '../../../core/model/formularios/diario-movil.model';

@Component({
  selector: 'app-diario-movil',
  templateUrl: './diario-movil.component.html',
  styleUrls: ['./diario-movil.component.scss'],
})
export class DiarioMovilComponent implements OnInit {
  formularios: DiarioMovil[] = [];
  exportData: DiarioMovil[] = [];
  columnas = ['movil', 'instructor', 'kilometraje', 'observaciones', 'fecha'];

  exportarExcel = () => {
    this.formulariosService
      .getExcelDiarioMovil(this.exportData.map((f) => f.id))
      .subscribe(({ file }: any) =>
        downloadFileFromBase64(
          file,
          `diario-movil-${moment().format('DD-MM-yyyy')}.xlsx`
        )
      );
  };
  actualizar = () => {
    this.formulariosService.getDiarioMovil().subscribe((formularios) => {
      formularios = formularios.map((form) => {
        form.fecha = moment(form.fechaCreacion).format('DD/MM/yyyy HH:mm');
        return form;
      });
      this.formulariosService.setFormularios('diarioMovil', formularios);
    });
  };

  actionsHeader: Actions[] = [
    {
      title: 'Exportar a excel',
      callback: this.exportarExcel,
    },
    {
      title: 'Actualizar',
      callback: this.actualizar,
    },
  ];
  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.formulariosService.formularios$.subscribe(({ diarioMovil }) => {
      this.formularios = diarioMovil;
      this.exportData = diarioMovil;
    });
    this.formulariosService.getDiarioMovil().subscribe((formularios) => {
      formularios = formularios.map((form) => {
        form.fecha = moment(form.fechaCreacion).format('DD/MM/yyyy HH:mm');
        return form;
      });
      this.formulariosService.setFormularios('diarioMovil', formularios);
    });
  }

  changeData(formularios) {
    this.exportData = formularios;
  }
}
