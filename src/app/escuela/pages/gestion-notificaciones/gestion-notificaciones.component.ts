import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions } from '@core/model/actions.model';
import { AcuService } from '@core/services/acu.service';
import { environment } from '@environments/environment';
import { EnviarNotificacionComponent } from '@escuela/components/modals/enviar-notificacion/enviar-notificacion.component';
import * as moment from 'moment';
import { EnvioNotificacion } from '../../../core/model/envio-notificacion.model';

@Component({
  selector: 'app-gestion-notificaciones',
  templateUrl: './gestion-notificaciones.component.html',
  styleUrls: ['./gestion-notificaciones.component.scss'],
})
export class GestionNotificacionesComponent implements OnInit {
  notificaciones: EnvioNotificacion[] = [];

  displayedColumns = [
    'alumnoNumero',
    'alumnoCelular',
    'mensaje',
    'fecha',
    'periodicidad',
    'usrId',
    'tipoDescripcion',
  ];
  dataSource: MatTableDataSource<EnvioNotificacion>;
  verNotificaciones: boolean = false;
  filtro: string;

  // Test paginator
  pageSize = environment.pageSize;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  enviarNotificacion = () => {
    const dialogRef = this.dialog.open(EnviarNotificacionComponent);

    dialogRef.afterClosed().subscribe();
  };

  actionsHeader: Actions[] = [
    {
      title: 'Enviar Notificación',
      callback: this.enviarNotificacion,
    },
  ];
  constructor(private dialog: MatDialog, private acuService: AcuService) {}

  ngOnInit(): void {
    this.acuService
      .obtenerNotificaciones()
      .subscribe((notificaciones: EnvioNotificacion[]) => {
        console.log(notificaciones);

        notificaciones = notificaciones['CollectionSDTEnvioNotificacion'];
        notificaciones = notificaciones.map((n) => {
          n.fecha = moment(n.fecha).format('DD/MM/yyyy hh:mm');
          return n;
        });
        this.dataSource = new MatTableDataSource(notificaciones);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.verNotificaciones = true;
        this.paginator._intl.itemsPerPageLabel = 'Items por Página';
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
