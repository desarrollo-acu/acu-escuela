import { Component, OnInit } from '@angular/core';
import { Actions } from '@core/model/actions.model';
import { FormulariosService } from '@core/services/formularios.service';
import { DiarioMovil } from '../../../core/model/formularios/diario-movil.model';

@Component({
  selector: 'app-diario-movil',
  templateUrl: './diario-movil.component.html',
  styleUrls: ['./diario-movil.component.scss'],
})
export class DiarioMovilComponent implements OnInit {
  formularios: DiarioMovil[] = [];
  columnas = ['movCod', 'escInsId', 'movilKilometraje', 'observaciones'];
  actionsHeader: Actions[] = [
    {
      title: 'Exportar a excel',
      callback: this.exportarExcel,
    },
  ];

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

  exportarExcel() {
    console.log(' exportando ...');
  }
}
