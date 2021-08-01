import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { AcuService, LiberarParameters } from 'src/app/core/services/acu.service';
import { CopiarMoverParameters } from 'src/app/core/model/copiarMoverParameters.model';
import { AutenticacionService } from '../../../../core/services/autenticacion.service';
import { confirmacionUsuario } from '../../../../utils/sweet-alert';

@Component({
  selector: 'app-seleccionar-accion-agenda',
  templateUrl: './seleccionar-accion-agenda.component.html',
  styleUrls: ['./seleccionar-accion-agenda.component.scss'],
})
export class SeleccionarAccionAgendaComponent {
  pegar: boolean;
  verOpciones: boolean;
  constructor(
    // tslint:disable-next-line: variable-name
    private _bottomSheetRef: MatBottomSheetRef<SeleccionarAccionAgendaComponent>,
    private acuService: AcuService,
    private auth: AutenticacionService,
    public dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.verOpciones = this.data.verOpciones;
    this.pegar = JSON.parse(localStorage.getItem('pegar-clase'));
  }

  openLink(event: MouseEvent, key: string): void {


    const fechaClase = localStorage.getItem('fechaClase');

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

        localStorage.setItem( 'copiarMoverParameters', JSON.stringify(copiarMoverParameters) );

        this.setPegarStorage();
        break;

      case 'liberar-clase':
        continuar = false;

        confirmacionUsuario(
          'Confirmación de usuario',
          'ATENCIÓN: Se liberará la hora, perdiendose los datos actuales. ¿Confirma continuar?'
        ).then((result) => {
          if (result.value) {
            const liberarParameters: LiberarParameters = {
              fechaClase: mainParameters.fecha,
              horaClase: mainParameters.hora,
              movil: mainParameters.movil,
              escInsId: mainParameters.instructor,
              usrId: this.auth.getUserId(),
              esMovil: mainParameters.esMovil,
            };
            this.acuService
              .liberarClase(liberarParameters)
              .subscribe((res: any) => {
                Swal.fire({
                  icon: 'success',
                  title: res.Msg,
                  showConfirmButton: false,
                  timer: 4000,
                });
                localStorage.setItem('refreshLiberaAgenda', 'true');

              this.cerrarBottomSheet(true, event);
              });
          }
        });

        break;

      case 'pegar-clase':
        const oldParameters = JSON.parse( localStorage.getItem('copiarMoverParameters') );

        if (existe) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ese turno ya esta ocupado, elegi otro!',
          });
        } else {
          if (oldParameters.fechaOld > mainParameters.fecha) {
            continuar = false;
            confirmacionUsuario(
              'Confirmación de usuario',
              'ATENCIÓN: La fecha seleccionada es anterior a la actual. ¿Confirma continuar?'
            ).then((result) => {
              if (result.value) {
                this.copiarMoverClase(oldParameters, mainParameters);
              }

              this.cerrarBottomSheet(true, event);
            });
          } else {
            this.copiarMoverClase(oldParameters, mainParameters);

            this.cerrarBottomSheet(true, event);
          }
        }
        break;

      case 'cancelar':
        this.setPegarStorage();
        break;

      default:
        this.acuService.cleanStorageAgenda();
        break;
    }

    if (continuar) {
      this.cerrarBottomSheet(true, event);
    }
  }

  cerrarBottomSheet(correcto?: boolean, event?: Event) {
    this._bottomSheetRef.dismiss(correcto);
    event.preventDefault();
  }

  setPegarStorage() {
    this.pegar = !this.pegar;
    localStorage.setItem('pegar-clase', this.pegar.toString());
  }

  copiarMoverClase(oldParameters, mainParameters) {

    const params: CopiarMoverParameters = {
      accion: oldParameters.accion,
      fechaClaseOld: oldParameters.fechaOld,
      horaClaseOld: oldParameters.horaOld,
      movilOld: oldParameters.movilOld,
      escInsIdOld: oldParameters.escInsIdOld,
      fechaClase: mainParameters.fecha,
      horaClase: mainParameters.hora,
      movil: mainParameters.movil,
      escInsId: mainParameters.instructor,
      esMovil:  mainParameters.esMovil,
      userId: this.auth.getUserId()
    };

    if (oldParameters.accion === 'MOVER') {
      localStorage.setItem('limpiarCeldaOld', 'true');
    }
    params.esMovil ?
    this.acuService.copiarMoverClase(params).subscribe((res: any) => {
      Swal.fire({
        icon: 'success',
        title: res.Gx_msg,
        showConfirmButton: false,
        timer: 4000,
      });

      localStorage.setItem('classOld', oldParameters.classOld);
      localStorage.setItem('textOld', oldParameters.textOld);
      localStorage.setItem('refreshAgenda', 'true');
    })
    : this.acuService.copiarMoverInstructorClase(params).subscribe( (res:any) =>
      {
        Swal.fire({
        icon: 'success',
        title: res.Gx_msg,
        showConfirmButton: false,
        timer: 4000,
      });

      localStorage.setItem('classOld', oldParameters.classOld);
      localStorage.setItem('textOld', oldParameters.textOld);
      localStorage.setItem('refreshAgenda', 'true');
    }
      );

    this.setPegarStorage();
  }
}
