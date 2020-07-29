import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { AcuService, LiberarParameters } from 'src/app/core/services/acu.service';
import { CopiarMoverParameters } from 'src/app/core/model/copiarMoverParameters.model';


@Component({
  selector: 'app-seleccionar-accion-agenda',
  templateUrl: './seleccionar-accion-agenda.component.html',
  styleUrls: ['./seleccionar-accion-agenda.component.scss']
})
export class SeleccionarAccionAgendaComponent {
  animal: any;
  pegar: boolean;
  verOpciones: boolean;
  constructor(
    // tslint:disable-next-line: variable-name
    private _bottomSheetRef: MatBottomSheetRef<SeleccionarAccionAgendaComponent>,
    private acuService: AcuService,
    public dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.verOpciones = this.data.verOpciones;
    this.pegar = JSON.parse(localStorage.getItem('pegar-clase'));
  }

  openLink(event: MouseEvent, key: string): void {
    console.log('estoy en openlink');

    const fechaClase = localStorage.getItem('fechaClase');

    const tipoAgenda = localStorage.getItem('tipoAgenda');
    const existe: boolean = JSON.parse(localStorage.getItem('existe'));
    const mainParameters = JSON.parse(localStorage.getItem('mainParameters'));

    console.log('2)fechaClase: ', fechaClase);
    localStorage.removeItem('abrirAgenda');
    let continuar = true;
    switch (key) {

      case 'abrir-clase':
        localStorage.setItem('abrirAgenda', tipoAgenda);
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
          accion: (key === 'mover-clase') ? 'MOVER' : 'COPIAR',
          fechaOld: mainParameters.fecha,
          movilOld: mainParameters.movil,
          horaOld: mainParameters.hora,
          classOld: mainParameters.class,
          textOld: mainParameters.text,
        };

        localStorage.setItem('copiarMoverParameters', JSON.stringify(copiarMoverParameters));

        this.setPegarStorage();
        break;

      case 'liberar-clase':

        continuar = false;
        this.confirmacionUsuario('Confirmación de usuario',
          'ATENCIÓN: Se liberará la hora, perdiendose los datos actuales. ¿Confirma continuar?')
          .then((result) => {
            if (result.value) {
              const liberarParameters: LiberarParameters = {
                fechaClase: mainParameters.fecha,
                horaClase: mainParameters.hora,
                movil: mainParameters.movil
              };
              this.acuService.liberarClase(liberarParameters)
                .subscribe((res: any) => {

                  Swal.fire({
                    icon: 'success',
                    title: res.Gx_msg,
                    showConfirmButton: false,
                    timer: 4000
                  });
                  localStorage.setItem('refreshLiberaAgenda', 'true');

                });
            }
          });



        break;

      case 'pegar-clase':

        const oldParameters = JSON.parse(localStorage.getItem('copiarMoverParameters'));

        if (existe) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ese turno ya esta ocupado, elegi otro!'
          });
        } else {
          if (oldParameters.fechaOld > mainParameters.fecha) {
            continuar = false;
            this.confirmacionUsuario(
              'Confirmación de usuario',
              'ATENCIÓN: La fecha seleccionada es anterior a la actual. ¿Confirma continuar?')
              .then((result) => {
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


  mensajeConfirmacion(title, text) {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 5000,
      showConfirmButton: false,
      onClose: () => {
        console.log('Cieerro antes de timer');
      }
    });
  }

  confirmacionUsuario(title, text) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });
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
      fechaClase: mainParameters.fecha,
      horaClase: mainParameters.hora,
      movil: mainParameters.movil,
    };
    console.log('params :::: ', params);
    if (oldParameters.accion === 'MOVER') {
      localStorage.setItem('limpiarCeldaOld', 'true');
    }
    this.acuService.copiarMoverClase(params)
      .subscribe((res: any) => {

        Swal.fire({
          icon: 'success',
          title: res.Gx_msg,
          showConfirmButton: false,
          timer: 4000
        });


        localStorage.setItem('classOld', oldParameters.classOld);
        localStorage.setItem('textOld', oldParameters.textOld);
        localStorage.setItem('refreshAgenda', 'true');
      });


    this.setPegarStorage();
  }
}
