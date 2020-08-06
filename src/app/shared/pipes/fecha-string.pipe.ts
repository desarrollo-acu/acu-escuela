import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaString'
})
export class FechaStringPipe implements PipeTransform {

  transform(fecha: any): string {
    const auxDate = new Date(fecha);

    const day = (auxDate.getDate() < 10) ? `0${auxDate.getDate()}` : `${auxDate.getDate()}`;
    const month = (auxDate.getMonth() < 10) ? `0${auxDate.getMonth()}` : `${auxDate.getMonth()}`;

    return `${day}/${month}/${auxDate.getFullYear()}`;
  }

}
