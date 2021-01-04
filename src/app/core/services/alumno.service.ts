import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Alumno } from '../model/alumno.model';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  private alumnoDataSource = new BehaviorSubject({
    modo: 'INS',
    alumno: {},
    numero: 0,
  });

  alumnoCurrentData = this.alumnoDataSource.asObservable();

  constructor(private http: HttpClient) {}

  sendDataAlumno(modo: string, alumno: Alumno, numero?: number) {
    const data: { modo: string; alumno: Alumno; numero: number } = numero
      ? { modo, alumno, numero }
      : { modo, alumno, numero: 0 };

    this.alumnoDataSource.next(data);
  }

  alumnoTieneExcepcion(aluNro: number) {
    const fechaClaseStr = localStorage.getItem('fechaClase').substring(0, 10);
    const horaClaseStr = localStorage.getItem('horaClase');

    const fechaClase = Date.parse(fechaClaseStr);
    const horaClase = parseInt(horaClaseStr, 10);

    return this.http.post(`${environment.url_ws}/wsAlumnoTieneExcepcion`, {
      AluNro: aluNro,
      FchClase: fechaClaseStr,
      HorClase: horaClase,
    });
  }

  existeAlumno(aluNro: number) {
    return this.http.post(`${environment.url_ws}/wsExisteAlumno`, {
      AluNro: aluNro,
    });
  }

  existeAlumnoByCI(aluCi: number) {
    return this.http.get(
      `${environment.url_ws}/existeAlumnoByCi?aluCi=${aluCi}`
    );
  }

  alumnoYaAsignado(aluNro: number) {
    const fechaClaseStr = localStorage.getItem('fechaClase').substring(0, 10);
    const horaClaseStr = localStorage.getItem('horaClase');
    const movilCodStr = localStorage.getItem('movilCod');

    const fechaClase = Date.parse(fechaClaseStr);
    const horaClase = parseInt(horaClaseStr, 10);
    const movilCod = parseInt(movilCodStr, 10);

    return this.http.post(`${environment.url_ws}/wsAlumnoYaAsignado`, {
      AluNro: aluNro,
      FchClase: fechaClaseStr,
      HorClase: horaClase,
      EscMovCod: movilCod,
    });
  }

  getDisponibilidadAlumno(aluId: number) {
    return this.http.post(
      `${environment.url_ws}/wsObtenerDisponibilidadPorAlumno`,
      {
        AluId: aluId,
      }
    );
  }

  getAlumnos() {
    return this.http.post(`${environment.url_ws}/wsObtenerAlumnos`, {});
  }

  obtenerAlumnos = (pageSize: number, pageNumber: number, filtro: string)  =>  this.http.get(
      `${environment.url_ws}/wsGetAlumnos?PageSize=${pageSize}&PageNumber=${pageNumber}&Filtro=${filtro}`
    );

  obtenerAlumnoByCI = ( ci: number ) => this.http.get( `${environment.url_ws}/wsGetAlumnoByCI?CI=${ci}`);

  gestionAlumno(mode: string, alumno: Alumno) {
    return this.http.post(`${environment.url_ws}/wsGestionAlumno`, {
      Alumno: {
        Mode: mode,
        Alumno: alumno,
      },
    });
  }

  getAlumnoNumero() {
    return this.http.get(`${environment.url_ws}/wsGetUltimoNumeroAlumno`);
  }
}
