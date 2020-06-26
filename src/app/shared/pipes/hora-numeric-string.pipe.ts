import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaNumericString'
})
export class HoraNumericStringPipe implements PipeTransform {

  transform(hora: number): string {

    switch (hora) {
      case 0:
        return '00:00';
      case 100:
        return '01:00';
      case 200:
        return '02:00';
      case 300:
        return '03:00';
      case 400:
        return '04:00';
      case 500:
        return '05:00';
      case 600:
        return '06:00';
      case 700:
        return '07:00';
      case 800:
        return '08:00';
      case 900:
        return '09:00';
      case 1000:
        return '10:00';
      case 1100:
        return '11:00';
      case 1200:
        return '12:00';
      case 1300:
        return '13:00';
      case 1400:
        return '14:00';
      case 1500:
        return '15:00';
      case 1600:
        return '16:00';
      case 1700:
        return '17:00';
      case 1800:
        return '18:00';
      case 1900:
        return '19:00';
      case 2000:
        return '20:00';
      case 2100:
        return '21:00';
      case 2200:
        return '22:00';
      case 2300:
        return '23:00';
      case 2400:
        return '00:00';
    }
  }

}
