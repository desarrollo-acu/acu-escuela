import { Pipe, PipeTransform } from '@angular/core';
import { horaToString } from '../../utils/utils-functions';

@Pipe({
  name: 'horasArrayToString',
})
export class HorasArrayToStringPipe implements PipeTransform {
  transform(value: string[]): string {
    const result = value.reduce((acc, item) => {
      const numbers = item.split('-').map((n) => parseInt(n));
      let valueString =
        numbers.reduce((acc, hora) => acc + `${horaToString(hora)}-`, '') + ',';
      valueString = valueString.replace('-,', ', ');
      return acc + valueString;
    }, '');
    return result.substring(0, result.length - 2);
  }
}
