import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'datetimeToString',
})
export class DatetimeToStringPipe implements PipeTransform {
  transform(value: Date): string {
    return moment(value).format('DD/MM/yyyy HH:mm');
  }
}
