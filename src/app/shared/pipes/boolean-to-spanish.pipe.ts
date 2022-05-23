import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToSpanish',
})
export class BooleanToSpanishPipe implements PipeTransform {
  transform(value: boolean): string {
    if (value) return value ? 'Si' : 'No';
  }
}
