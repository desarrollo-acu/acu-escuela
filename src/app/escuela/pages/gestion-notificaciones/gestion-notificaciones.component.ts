import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@core/model/actions.model';
import { AcuService } from '@core/services/acu.service';
import { EnviarNotificacionComponent } from '@escuela/components/modals/enviar-notificacion/enviar-notificacion.component';
import { EnvioNotificacion } from '../../../core/model/envio-notificacion.model';

@Component({
  selector: 'app-gestion-notificaciones',
  templateUrl: './gestion-notificaciones.component.html',
  styleUrls: ['./gestion-notificaciones.component.scss']
})
export class GestionNotificacionesComponent implements OnInit {

  notificaciones: EnvioNotificacion[] = [];

  columnas = ['alumnoCelular', 'alumnoNumero', 'mensaje', 'fecha', 'periodicidad', 'usrId', 'tipoDescripcion'];

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
  constructor( private dialog: MatDialog,
    private acuService: AcuService,) { }

  ngOnInit(): void {
    this.acuService.obtenerNotificaciones().subscribe( notificaciones => this.notificaciones = notificaciones)
  }

}
