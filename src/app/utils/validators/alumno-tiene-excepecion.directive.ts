import { Directive } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

import { map } from 'rxjs/operators';


import { Observable } from 'rxjs';
import { AcuService } from 'src/app/core/services/acu.service';

export function alumnoTieneExcepcionValidator(acuService: AcuService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return acuService.alumnoTieneExcepcion(control.value).pipe(
      map(
        (res: any) => {
          console.log('AlumnoTieneExcepclion.res: ', res);
          console.log('AlumnoTieneExcepclion.res.tieneExcepcion: ', res.tieneExcepcion);
          // tslint:disable-next-line: object-literal-key-quotes
          return res.tieneExcepcion ? { 'alumnoTieneExcepcion': true } : null;
        })
    );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alumnoTieneExcepcion][formControlName],[alumnoTieneExcepcion][formControl],[alumnoTieneExcepcion][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: AlumnoTieneExcepecionValidatorDirective, multi: true }]
})
export class AlumnoTieneExcepecionValidatorDirective implements AsyncValidator {
  constructor(private acuService: AcuService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return alumnoTieneExcepcionValidator(this.acuService)(control);
  }
}
