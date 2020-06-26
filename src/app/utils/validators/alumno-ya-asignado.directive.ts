import { Directive } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

import { map } from 'rxjs/operators';

import { AcuService } from 'src/app/core/services/acu.service';
import { Observable } from 'rxjs';

export function alumnoYaAsignadoValidator(acuService: AcuService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return acuService.alumnoYaAsignado(control.value).pipe(
      map(
        (res: any) => {
          console.log('res: ', res);
          console.log('res.yaAsignado: ', res.yaAsignado);
          // tslint:disable-next-line: object-literal-key-quotes
          return res.yaAsignado ? { 'alumnoYaAsignado': true } : null;
        })
    );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alumnoYaAsignado][formControlName],[alumnoYaAsignado][formControl],[alumnoYaAsignado][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: AlumnoYaAsignadoValidatorDirective, multi: true }]
})
export class AlumnoYaAsignadoValidatorDirective implements AsyncValidator {
  constructor(private acuService: AcuService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return alumnoYaAsignadoValidator(this.acuService)(control);
  }
}
