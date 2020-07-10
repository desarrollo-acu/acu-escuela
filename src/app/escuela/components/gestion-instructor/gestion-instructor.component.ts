import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AcuService } from '@core/services/acu.service';
import { Router } from '@angular/router';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';
import { Instructor } from '@core/model/instructor.model';

@Component({
  selector: 'app-gestion-instructor',
  templateUrl: './gestion-instructor.component.html',
  styleUrls: ['./gestion-instructor.component.scss']
})
export class GestionInstructorComponent implements OnInit {

  displayedColumns: string[] = ['actions', 'EscInsId', 'EscInsNom', 'EscInsNomCor', 'EscInsTel', 'EscInsAct'];
  dataSource: MatTableDataSource<Instructor>;
  verInstructor: boolean;
  filtro: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private acuService: AcuService,
    private router: Router) {

  }

  ngOnInit() {



    this.getInstructores();

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abmInstructor(modo: string, instructor: Instructor) {
    switch (modo) {
      case 'INS':

        this.acuService.sendDataInstructor(modo, instructor, 0);
        this.router.navigate(['/escuela/abm-instructor']);
        // });
        break;
      case 'UPD':

        this.acuService.sendDataInstructor(modo, instructor);
        this.router.navigate(['/escuela/abm-instructor']);
        break;
      case 'DLT':
        confirmacionUsuario(
          'Confirmación de Usuario',
          `Está seguro que desea eliminar el instructor: ${instructor.EscInsNom}`)
          .then((confirm) => {
            if (confirm.isConfirmed) {
              this.acuService.gestionInstructor(modo, instructor).subscribe((res: any) => {
                console.log('res eli:', res);

                mensajeConfirmacion('Ok', res.Instructor.ErrorMessage).then((res2) => {

                  this.getInstructores();

                });

              });
            }
          });

        break;

      default:
        break;
    }

  }

  getInstructores() {

    this.verInstructor = false;
    this.acuService.getInstructores()
      .subscribe((instructores: Instructor[]) => {
        console.log('instructores instructoinstructores: ', instructores);


        this.verInstructor = true;
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(instructores);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

  }

}

