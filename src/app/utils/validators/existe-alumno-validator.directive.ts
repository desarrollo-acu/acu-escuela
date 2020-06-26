import { Directive } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

import { map } from 'rxjs/operators';

import { AcuService } from 'src/app/core/services/acu.service';
import { Observable } from 'rxjs';

export function existeAlumnoValidator(acuService: AcuService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return acuService.existeAlumno(control.value).pipe(
      map(
        (res: any) => {
          console.log('res: ', res);
          console.log('res.existe: ', res.existe);
          // tslint:disable-next-line: object-literal-key-quotes
          return !res.existe ? { 'existeAlumno': true } : null;
        })
    );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[existeAlumno][formControlName],[existeAlumno][formControl],[existeAlumno][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: ExisteAlumnoValidatorDirective, multi: true }]
})
export class ExisteAlumnoValidatorDirective implements AsyncValidator {
  constructor(private acuService: AcuService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return existeAlumnoValidator(this.acuService)(control);
  }
}
