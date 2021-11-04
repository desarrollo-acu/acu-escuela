import { Component, OnInit } from '@angular/core';
import { Actions } from '@core/model/actions.model';
import { FormulariosService } from '@core/services/formularios.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';
import { DiarioMovil } from '../../../core/model/formularios/diario-movil.model';

@Component({
  selector: 'app-diario-movil',
  templateUrl: './diario-movil.component.html',
  styleUrls: ['./diario-movil.component.scss'],
})
export class DiarioMovilComponent implements OnInit {
  formularios: DiarioMovil[] = [];
  columnas = ['movil', 'instructor', 'kilometraje', 'observaciones'];

  actionsHeader: Actions[] = [{}];
  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.formulariosService.formularios$.subscribe(
      ({ diarioMovil }) => (this.formularios = diarioMovil)
    );
    this.formulariosService
      .getDiarioMovil()
      .subscribe((formularios) =>
        this.formulariosService.setFormularios('diarioMovil', formularios)
      );
  }

  changeData(formularios){
    console.log(formularios);

    setTimeout( () => this.formulariosService.setFormularios('diarioMovil', formularios), 500 )
  }

  exportarExcel(){
    console.log(' exportando ...');
    this.formulariosService.getExcelDiarioMovil( this.formularios.map( f => f.id) ).subscribe( ({file}: any) => {
      console.log(' aca paso ', file);

      downloadFileFromBase64(file, 'diario-movil.xlsx');
    });
  }

}
