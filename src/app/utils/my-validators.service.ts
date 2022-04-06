import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlumnoService } from '@core/services/alumno.service';
import { errorMensaje } from './sweet-alert';

@Injectable({
  providedIn: 'root'
})
export class MyValidatorsService {

  constructor(private alumnoService: AlumnoService) { }


  alumnoTieneFacturasPendientes( aluId: number, aluNomComp: string, control: AbstractControl){
    this.alumnoService
      .tieneFacturaPendienteAnteriorAHoy(aluId)
      .subscribe(({ tieneFacturaPendienteAnteriorAHoy }) => {
        if (tieneFacturaPendienteAnteriorAHoy) {
          errorMensaje(
            'Error',
            `El alumno ${aluNomComp} tiene facturas pendientes anteriores a hoy.`
          ).finally(() =>
          control.setErrors({
              'tiene-facturas-pendientes-de-pago': true,
            })
          );
        }
      });


  }
}
