import { Injectable } from '@angular/core';
import { AcuService } from '@core/services/acu.service';
import { MovilService } from '@core/services/movil.service';
import { AutenticacionService } from '@core/services/autenticacion.service';
import { CopiarMoverParameters } from '@core/model/copiarMoverParameters.model';
import { mensajeConfirmacion, errorMensaje } from '@utils/sweet-alert';
import { SeleccionarMovilComponent } from '@escuela/components/modals/seleccionar-movil/seleccionar-movil.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class CopiarMoverClaseInstructorService {
  constructor(
    private acuService: AcuService,
    private movilService: MovilService,
    private auth: AutenticacionService,
    public dialog: MatDialog
  ) {}

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
      esMovil: mainParameters.esMovil,
      userId: this.auth.getUserId(),
    };

    if (oldParameters.accion === 'MOVER') {
      localStorage.setItem('limpiarCeldaOld', 'true');
    }
    params.esMovil
      ? this.acuService
          .copiarMoverClase(params)
          .subscribe((res: any) =>
            this.finalizarCopiarMoverClase(
              res,
              oldParameters,
              mainParameters,
              params
            )
          )
      : this.acuService
          .copiarMoverInstructorClase(params)
          .subscribe((res: any) =>
            this.finalizarCopiarMoverClase(
              res,
              oldParameters,
              mainParameters,
              params
            )
          );
  }

  finalizarCopiarMoverClase(res, oldParameters, mainParameters, params) {
    if (res.errorCode === 0) {
      mensajeConfirmacion('Excelente!', res.Msg);
      localStorage.setItem('abrirAgenda', `pegar-clase-ok`);
    } else {
      if (res.elegirOtroMovil) {
        errorMensaje('Oops...', res.Msg).then(() => {
          this.movilService
            .getMovilesDisponiblesPorFechaHora(
              params.fechaClase,
              params.horaClase
            )
            .subscribe((moviles) => {
              const movilesDialogRef = this.dialog.open(
                SeleccionarMovilComponent,
                {
                  height: 'auto',
                  width: '700px',
                  data: {
                    moviles,
                  },
                }
              );

              movilesDialogRef.afterClosed().subscribe((movil) => {
                if (movil) {
                  this.copiarMoverClase(oldParameters, {
                    ...mainParameters,
                    movil: movil.MovCod,
                  });
                } else {
                  localStorage.setItem('abrirAgenda', `pegar-clase-ok`);
                  this.salirCopiarMoverClase(oldParameters);
                }
              });
            });
        });
        return;
      } else {
        errorMensaje('Oops...', res.Msg);
      }
    }
    this.salirCopiarMoverClase(oldParameters);
  }

  salirCopiarMoverClase(oldParameters) {
    localStorage.setItem('classOld', oldParameters.classOld);
    localStorage.setItem('textOld', oldParameters.textOld);
    localStorage.setItem('refreshAgenda', 'true');
  }
}
