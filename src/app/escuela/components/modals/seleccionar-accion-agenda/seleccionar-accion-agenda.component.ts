import { Component, Inject } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

import { AcuService } from 'src/app/core/services/acu.service';

import {
  confirmacionUsuario,
  errorMensaje,
} from '../../../../utils/sweet-alert';

import * as moment from 'moment';

import { FechaXDiasAnteriorAHoy } from '@utils/utils-functions';
@Component({
  selector: 'app-seleccionar-accion-agenda',
  templateUrl: './seleccionar-accion-agenda.component.html',
  styleUrls: ['./seleccionar-accion-agenda.component.scss'],
})
export class SeleccionarAccionAgendaComponent {
  today = new Date(moment().toDate().setHours(0, 0, 0, 0));
  pegar: boolean;
  verOpciones: boolean;
  fechaClase: Date;
  usuarioConPermiso: boolean = false;
  fechaAnteriorMaxima;
  private usuarioConPermisoNombre: string = 'RRUBIO'; //Solo este usuario podra mover y suspender clases de hasta 3 días pasados.

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SeleccionarAccionAgendaComponent>,
    private acuService: AcuService,
    public dialog: MatDialog,

    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.fechaClase = moment(this.data.fechaClase).toDate();

    if (
      localStorage.getItem('usrId').toUpperCase() ===
      this.usuarioConPermisoNombre
    )
      this.usuarioConPermiso = true;

    this.verOpciones = this.data.verOpciones;
    this.pegar = JSON.parse(localStorage.getItem('pegar-clase'));
    //TODO 3 días atras....
    this.fechaAnteriorMaxima = new Date(FechaXDiasAnteriorAHoy(7)); // La fecha de 3 días para atras.
  }

  openLink(event: MouseEvent, key: string): void {
    const tipoAgenda = localStorage.getItem('tipoAgenda');
    const existe: boolean = JSON.parse(localStorage.getItem('existe'));
    const mainParameters = JSON.parse(localStorage.getItem('mainParameters'));

    localStorage.removeItem('abrirAgenda');
    let continuar = true;
    switch (key) {
      case 'abrir-clase':
        localStorage.setItem('abrirAgenda', tipoAgenda);
        break;

      case 'examen-clase':
        localStorage.setItem('abrirAgenda', `examen-${tipoAgenda}`);
        break;

      case 'clase-adicional':
        localStorage.setItem('abrirAgenda', `clase-adicional-${tipoAgenda}`);
        break;

      case 'evaluacion-practica':
        localStorage.setItem(
          'abrirAgenda',
          `evaluacion-practica-${tipoAgenda}`
        );
        break;

      case 'suspender-clase':
        localStorage.setItem('abrirAgenda', `suspender-${tipoAgenda}`);
        break;

      case 'duplicar-clase':
        localStorage.setItem('abrirAgenda', `duplicar-${tipoAgenda}`);
        break;

      case 'mover-clase':
      case 'copiar-clase': // setItem('abrirAgenda', tipoAgenda);
        const copiarMoverParameters = {
          accion: key === 'mover-clase' ? 'MOVER' : 'COPIAR',
          fechaOld: mainParameters.fecha,
          movilOld: mainParameters.movil,
          escInsIdOld: mainParameters.instructor,
          horaOld: mainParameters.hora,
          classOld: mainParameters.class,
          textOld: mainParameters.text,
        };

        localStorage.setItem(
          'copiarMoverParameters',
          JSON.stringify(copiarMoverParameters)
        );

        this.setPegarStorage();
        break;

      case 'pegar-clase':
        const oldParameters = JSON.parse(
          localStorage.getItem('copiarMoverParameters')
        );

        if (existe) {
          errorMensaje('Oops...', 'Ese turno ya esta ocupado, elegí otro!');
        } else {
          continuar = false;
          if (oldParameters.fechaOld > mainParameters.fecha) {
            confirmacionUsuario(
              'Confirmación de usuario',
              'ATENCIÓN: La fecha seleccionada es anterior a la actual. ¿Confirma continuar?'
            ).then((result) => {
              if (result.value) {
                this.copiarMoverClase(oldParameters, mainParameters, event);
              }
            });
          } else {
            this.copiarMoverClase(oldParameters, mainParameters, event);
          }
        }
        break;

      case 'cancelar':
        this.setPegarStorage();
        localStorage.setItem('abrirAgenda', `pegar-clase-ok`);
        break;

      default:
        this.acuService.cleanStorageAgenda();
        break;
    }

    if (continuar) {
      this.cerrarBottomSheet(true, event);
    }
  }

  copiarMoverClase(oldParameters, mainParameters, event) {
    localStorage.setItem('abrirAgenda', 'copiar-mover-clase');
    this.setPegarStorage();
    this.cerrarBottomSheet(true, event, {
      oldParameters,
      mainParameters,
      event,
    });
  }

  cerrarBottomSheet(correcto?: boolean, event?: Event, params?) {
    this._bottomSheetRef.dismiss({ seleccionoOpcion: correcto, params });
    event.preventDefault();
  }

  setPegarStorage() {
    this.pegar = !this.pegar;
    localStorage.setItem('pegar-clase', this.pegar.toString());
  }
}
