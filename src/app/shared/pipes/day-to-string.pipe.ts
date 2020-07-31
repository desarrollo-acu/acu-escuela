import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayToString'
})
export class DayToStringPipe implements PipeTransform {

  transform(fecha: Date): string {


    switch (fecha.getDay()) {
      case 1:
        return 'Lunes';
      case 2:
        return 'Martes';
      case 3:
        return 'Miércoles';
      case 4:
        return 'Jueves';
      case 5:
        return 'Viernes';
      case 6:
        return 'Sábado';
      case 7:
        return 'Domingo';
    }

  }

}
