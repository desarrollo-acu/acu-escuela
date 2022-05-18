import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'diaDeLaSemana',
})
export class DiaDeLaSemanaPipe implements PipeTransform {
  transform(value: Date): string {
    moment.locale('es');
    return moment(value).format('dddd');
  }
}
