import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ci'
})
export class CiPipe implements PipeTransform {

  transform(value: string, digitoVerificador?: string): string {


    const ci = value;
    const cant: any = Math.ceil(ci.length / 3);

    let cadena = new Array(cant);
    let substring = ci;
    let corte;
    let result = '';

    for (let i = 0; i < cant; i++) {


      corte = (substring.length - 3);
      cadena[i] = substring.substring(corte, substring.length);
      substring = substring.substring(corte, 0);


    }

    cadena = cadena.reverse();

    for (let i = 0; i < cadena.length; i++) {
      if (i + 1 < cadena.length) {
        result += cadena[i] + '.';
      } else {
        result += cadena[i] + '-';
      }
    }

    return result + digitoVerificador; //Math.pow(value, isNaN(exponent) ? 1 : exponent);
  }
}
