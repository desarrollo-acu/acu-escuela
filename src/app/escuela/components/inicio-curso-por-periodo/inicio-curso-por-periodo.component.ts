import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReportesService } from '@core/services/reportes.service';
import { downloadFileFromBase64 } from '@utils/utils-functions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-inicio-curso-por-periodo',
  templateUrl: './inicio-curso-por-periodo.component.html',
  styleUrls: ['./inicio-curso-por-periodo.component.scss']
})
export class InicioCursoPorPeriodoComponent implements OnInit {
  displayedColumns: string[] = ['AluNom', 'AluApe1', 'EscCurIni', 'AluNro', 'TipCurNom', 'AluTel1', 'AluTel2', 'SocId', 'AluDir', 'AluLocNom', 'AluDepNom', 'AluFchNac', 'AluMail', 'Instructor', 'FchIniReal', 'FchUltRealizado' ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  form: FormGroup;

  get fechaDesde() { return this.form.get('fechaDesde');  }
  get fechaHasta() { return this.form.get('fechaHasta');  }

  constructor(
    private reportesService: ReportesService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Items por Página';
  }

  private buildForm() {
    this.form = this.fb.group({
      fechaDesde: [null,Validators.required],
      fechaHasta: [null,Validators.required],
    });
  }

  getDataInicioCurso() {

    const {fechaDesde, fechaHasta} = this.form.value;

    if( !(fechaDesde && fechaHasta) )
      return;

    this.reportesService.dataIniciosCursosPorPeriodo(fechaDesde, fechaHasta).subscribe((data:any) => {
      console.log(data);

      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(data);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  generarReporte(e: Event) {
    e.preventDefault();

    const {fechaDesde, fechaHasta} = this.form.value;
    console.log(this.form.value);

    this.reportesService.iniciosCursosPorPeriodo(fechaDesde, fechaHasta).subscribe(({ dataBase64, filename}: any) => downloadFileFromBase64(dataBase64, filename));



  }

}
