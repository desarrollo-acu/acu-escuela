import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fechaString'
})
export class FechaStringPipe implements PipeTransform {

  transform(fecha: any): string {
    const auxDate =  moment(fecha);

    const monthNum = auxDate.month()+1;
    const dayNum =  auxDate.date();

    const day = (dayNum < 10) ? `0${dayNum}` : `${dayNum}`;
    const month = (monthNum < 10) ? `0${monthNum}` : `${monthNum}`;
    return `${day}/${month}/${auxDate.year()}`;
  }

}
