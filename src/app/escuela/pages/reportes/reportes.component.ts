import { Component, OnInit } from '@angular/core';
import { ReportesService } from '@core/services/reportes.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  tipo: string;
  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {}
  obtenerAlumnosCon10ClasesOmas() {
    this.reportesService
      .obtenerAlumnosCon10ClasesOmas()
      .subscribe(({ dataBase64, filename }: any) => {
        downloadFileFromBase64(dataBase64, filename);
      });
  }
}
