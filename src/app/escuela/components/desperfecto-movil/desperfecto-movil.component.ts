import { Component, OnInit } from '@angular/core';
import { FormulariosService } from '../../../core/services/formularios.service';
import { DesperfectoMovil } from '../../../core/model/formularios/desperfecto-movil.model';
import { Actions } from '@core/model/actions.model';

@Component({
  selector: 'app-desperfecto-movil',
  templateUrl: './desperfecto-movil.component.html',
  styleUrls: ['./desperfecto-movil.component.scss']
})
export class DesperfectoMovilComponent implements OnInit {

  formularios: DesperfectoMovil[] = [];
  columnas = ['movil', 'instructor', 'kilometraje', 'desperfecto', 'fecha']
  actionsHeader: Actions[] = [{
    title: 'Exportar a excel',
    callback: this.exportarExcel
  }];


  constructor(private formulariosService: FormulariosService) { }

  ngOnInit(): void {
    this.formulariosService.formularios$.subscribe( ({desperfectoMovil}) => this.formularios = desperfectoMovil);
    this.formulariosService.getDesperfectoMovil().subscribe( formularios => this.formulariosService.setFormularios( 'desperfectoMovil', formularios));
  }

  exportarExcel(){
    console.log(' exportando ...');
  }

}
