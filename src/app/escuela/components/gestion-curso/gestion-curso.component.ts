import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AcuService } from '@core/services/acu.service';
import { Curso } from '@core/model/curso.model';
import { Router } from '@angular/router';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';


@Component({
  selector: 'app-gestion-curso',
  templateUrl: './gestion-curso.component.html',
  styleUrls: ['./gestion-curso.component.scss']
})
export class GestionCursoComponent implements OnInit {

  displayedColumns: string[] = ['actions', 'TipCurId', 'TipCurNom', 'TipCurEst'];
  dataSource: MatTableDataSource<Curso>;
  verCurso: boolean;
  filtro: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private acuService: AcuService,
    private router: Router) {

  }

  ngOnInit() {



    this.getCursos();

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
        // this.acuService.getCursoNumero().subscribe((res: { numero: number }) => {
        //   console.log('res: ', res);


        this.acuService.sendDataCurso(modo, curso, 0);
        this.router.navigate(['/escuela/abm-curso']);
        // });
        break;
      case 'UPD':

        this.acuService.sendDataCurso(modo, curso);
        this.router.navigate(['/escuela/abm-curso']);
        break;
      case 'DLT':
        confirmacionUsuario('Confirmación de Usuario', `Está seguro que desea eliminar el curso: ${curso.TipCurNom}`).then((confirm) => {
          if (confirm.isConfirmed) {
            this.acuService.gestionCurso(modo, curso).subscribe((res: any) => {
              console.log('res eli:', res);

              mensajeConfirmacion('Ok', res.Curso.ErrorMessage).then((res2) => {

                this.getCursos();

              });

            });
          }
        });

        break;

      default:
        break;
    }

  }

  getCursos() {

    this.verCurso = false;
    this.acuService.getCursos().subscribe((cursos: Curso[]) => {
      console.log('Cursos: ', cursos);


      this.verCurso = true;
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(cursos);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

}

