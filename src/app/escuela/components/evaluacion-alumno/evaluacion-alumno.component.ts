import { Component, OnInit } from '@angular/core';
import { Actions } from '@core/model/actions.model';
import { FormulariosService } from '@core/services/formularios.service';
import { EvaluacionAlumno } from '../../../core/model/formularios/evaluacion-alumno.model';

@Component({
  selector: 'app-evaluacion-alumno',
  templateUrl: './evaluacion-alumno.component.html',
  styleUrls: ['./evaluacion-alumno.component.scss']
})
export class EvaluacionAlumnoComponent implements OnInit {
  formularios: EvaluacionAlumno[] = [];
  columnas = ['escInsId', 'alumnoNombreApellido', 'numeroClase' , 'observaciones'];
  actionsHeader: Actions[] = [
    {
      title: 'Exportar a excel',
      callback: this.exportarExcel,
    },
  ];

  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.formulariosService.formularios$.subscribe( ({evaluacionAlumno}) => this.formularios = evaluacionAlumno);
    this.formulariosService.getEvaluacionAlumno().subscribe( formularios => this.formulariosService.setFormularios( 'evaluacionAlumno', formularios));
  }

  exportarExcel() {
    console.log(' exportando ...');
  }
}

