import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaNumericString'
})
export class HoraNumericStringPipe implements PipeTransform {

  transform(hora: number): string {
    return (hora < 100) ? `${hora}:00` : `${hora/100}:00`;
  }

}
