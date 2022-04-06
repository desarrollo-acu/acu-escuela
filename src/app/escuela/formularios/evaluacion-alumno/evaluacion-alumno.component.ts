import { Component, OnInit } from '@angular/core';
import { Actions } from '@core/model/actions.model';
import { FormulariosService } from '@core/services/formularios.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';
import * as moment from 'moment';
import { EvaluacionAlumno } from '../../../core/model/formularios/evaluacion-alumno.model';

@Component({
  selector: 'app-evaluacion-alumno',
  templateUrl: './evaluacion-alumno.component.html',
  styleUrls: ['./evaluacion-alumno.component.scss']
})
export class EvaluacionAlumnoComponent implements OnInit {
  formularios: EvaluacionAlumno[] = [];
  exportData: EvaluacionAlumno[] = [];
  columnas = ['instructor', 'alumno', 'clase' , 'observaciones', 'fecha'];

  exportarExcel = () => {
    this.formulariosService
      .getExcelEvaluacionAlumno(this.exportData.map((f) => f.id))
      .subscribe(({ file }: any) =>
        downloadFileFromBase64(
          file,
          `evaluacion-alumno-${moment().toLocaleString()}.xlsx`
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
    this.formulariosService.formularios$.subscribe( ({evaluacionAlumno}) => {
      this.formularios = evaluacionAlumno;
      this.exportData = evaluacionAlumno;
    });
    this.formulariosService.getEvaluacionAlumno().subscribe( formularios => this.formulariosService.setFormularios( 'evaluacionAlumno', formularios));
  }

  changeData(formularios) {
    this.exportData = formularios;
  }

}

