import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daySpanish'
})
export class DaySpanishPipe implements PipeTransform {

  transform(day: string): any {
    switch (day) {
      case 'Monday':
        return 'Lunes';
      case 'Tuesday':
        return 'Martes';
      case 'Wednesday':
        return 'Miércoles';
      case 'Thursday':
        return 'Jueves';
      case 'Friday':
        return 'Viernes';
      case 'Saturday':
        return 'Sábado';
      case 'Sunday':
        return 'Domingo';
    }
  }

}
