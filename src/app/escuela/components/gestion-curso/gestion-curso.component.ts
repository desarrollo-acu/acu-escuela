import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CursoService } from '@core/services/curso.service';
import { Curso } from '@core/model/curso.model';
import { Router } from '@angular/router';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';

import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  downloadFile,
  base64ToBlob,
  downloadFileFromBase64,
} from '../../../utils/utils-functions';

import fileDownload from 'js-file-download';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-gestion-curso',
  templateUrl: './gestion-curso.component.html',
  styleUrls: ['./gestion-curso.component.scss'],
})
export class GestionCursoComponent implements OnInit {
  displayedColumns: string[] = [
    'actions',
    'TipCurId',
    'TipCurNom',
    'TipCurEst',
  ];
  dataSource: MatTableDataSource<Curso>;
  verCurso: boolean;
  filtro: string;

  estados = [];
  form: FormGroup;

  // Test paginator
  pageSize = environment.pageSize;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Items por Página';
    this.buildForm();
    this.getCursos('A');
    this.generateEstados();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abmCurso(modo: string, curso: Curso) {
    switch (modo) {
      case 'INS':
        this.cursoService.getUltimoCursoId().subscribe((cursoId) => {
          this.cursoService.sendDataCurso(modo, curso, cursoId);
          this.router.navigate(['/escuela/abm-curso']);
        });

        break;
      case 'UPD':
        this.cursoService.sendDataCurso(modo, curso);
        this.router.navigate(['/escuela/abm-curso']);
        break;
      case 'DLT':
        confirmacionUsuario(
          'Confirmación de Usuario',
          `Está seguro que desea eliminar el curso: ${curso.TipCurNom}`
        ).then((confirm) => {
          if (confirm.isConfirmed) {
            this.cursoService
              .gestionCurso(modo, curso)
              .subscribe((res: any) => {
                mensajeConfirmacion('Ok', res.errorMessage).then((res2) => {
                  this.getCursos(this.filtro);
                });
              });
          }
        });

        break;

      default:
        break;
    }
  }

  getCursos(TipCurEst?: string) {
    this.verCurso = false;
    this.cursoService.getCursos().subscribe((cursos: Curso[]) => {
      this.verCurso = true;
      const auxCursos =
        TipCurEst === '-' || !TipCurEst
          ? cursos
          : cursos.filter((curso) => curso.TipCurEst === TipCurEst);
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(auxCursos);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      tipCurEst: ['A'],
    });
  }

  verActivos(event: MatSelectChange) {
    const filterValue = event.value;
    this.getCursos(filterValue);
  }

  generateEstados() {
    const estado0 = {
      id: 0,
      value: '-',
      description: 'Todos',
    };

    this.estados.push(estado0);

    const estado1 = {
      id: 1,
      value: 'A',
      description: 'Activo',
    };
    this.estados.push(estado1);

    const estado2 = {
      id: 2,
      value: 'B',
      description: 'Baja',
    };
    this.estados.push(estado2);
  }

  getFile = () =>
    this.cursoService
      .testExcel()
      .subscribe(({ dataBase64, filename }: any) =>
        downloadFileFromBase64(dataBase64, filename)
      );
}
