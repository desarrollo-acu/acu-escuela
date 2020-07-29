import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDateFormatPipe'
})
export class CustomDateFormatPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const datePipe = new DatePipe('es-UY');

    console.log('1) value>> ', value);
    value = datePipe.transform(value, 'dd/mm/yyyy');
    console.log('2) value>> ', value);
    return value;
  }

}
