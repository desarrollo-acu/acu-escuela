import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoAlumno',
})
export class EstadoAlumnoPipe implements PipeTransform {
  transform(estado: string): string {
    let res = '';
    if (estado == 'A') {
      res = 'Activo';
    }
    if (estado == 'R') {
      res = 'Reprobado';
    }
    return res;
  }
}
