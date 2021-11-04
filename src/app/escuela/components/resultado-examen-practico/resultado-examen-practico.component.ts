import { Component, OnInit } from '@angular/core';
import { Actions } from '@core/model/actions.model';
import { FormulariosService } from '@core/services/formularios.service';
import { ResultadoExamenPractico } from '../../../core/model/formularios/resultado-examen-practico.model';

@Component({
  selector: 'app-resultado-examen-practico',
  templateUrl: './resultado-examen-practico.component.html',
  styleUrls: ['./resultado-examen-practico.component.scss']
})
export class ResultadoExamenPracticoComponent implements OnInit {

  formularios: ResultadoExamenPractico[] = [];
  columnas = ['instructor', 'alumno', 'resultado']
  actionsHeader: Actions[] = [{
    title: 'Exportar a excel',
    callback: this.exportarExcel
  }];

  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.formulariosService.formularios$.subscribe( ({resultadoExamenPractico}) => this.formularios = resultadoExamenPractico);
    this.formulariosService.getResultadoExamenPractico().subscribe( formularios => this.formulariosService.setFormularios( 'resultadoExamenPractico', formularios));

  }

  exportarExcel(){
    console.log(' exportando ...');
  }
}
