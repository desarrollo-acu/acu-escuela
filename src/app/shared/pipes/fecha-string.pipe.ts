import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaString'
})
export class FechaStringPipe implements PipeTransform {

  transform(fecha: any): string {
    const auxDate = new Date(fecha);

    const monthNum = auxDate.getMonth()+1;
    const dayNum = auxDate.getDate() +1;

    const day = (dayNum < 10) ? `0${dayNum}` : `${dayNum}`;
    const month = (monthNum < 10) ? `0${monthNum}` : `${monthNum}`;

    return `${day}/${month}/${auxDate.getFullYear()}`;
  }

}
