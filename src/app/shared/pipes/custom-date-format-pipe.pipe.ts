import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDateFormatPipe'
})
export class CustomDateFormatPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return new DatePipe('es-UY').transform(value, 'dd/mm/yyyy');;
  }

}
