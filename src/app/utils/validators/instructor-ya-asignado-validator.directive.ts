import { Directive } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

import { map } from 'rxjs/operators';

import { AcuService } from 'src/app/core/services/acu.service';
import { Observable } from 'rxjs';

export function instructorYaAsignadoValidator(acuService: AcuService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return acuService.instructorYaAsignado(control.value).pipe(
      map(
        (res: any) => {
          console.log('res: ', res);
          console.log('res.yaAsignado: ', res.yaAsignado);
          // tslint:disable-next-line: object-literal-key-quotes
          return res.yaAsignado ? { 'instructorYaAsignado': true } : null;
        })
    );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[instructorYaAsignado][formControlName],[instructorYaAsignado][formControl],[instructorYaAsignado][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: InstructorYaAsignadoValidatorDirective, multi: true }]
})
export class InstructorYaAsignadoValidatorDirective implements AsyncValidator {
  constructor(private acuService: AcuService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return instructorYaAsignadoValidator(this.acuService)(control);
  }
}
