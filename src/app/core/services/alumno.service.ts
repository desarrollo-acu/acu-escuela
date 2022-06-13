import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Alumno } from '../model/alumno.model';
import { CuentaCorriente } from '../model/cuenta-corriente.model';
import { Inscripcion } from '@core/model/inscripcion.model';
import { AlumnoResponse } from '../model/alumno-response.interface';
import { AlumnoSuspension } from '../model/alumno-suspension.interface';
import { ResponseSDTCustom } from '../model/response-sdt-custom.model';
import { ClaseSuspendida } from '../model/clase-suspendida-alumno.interface';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  aluId: number;

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

  existeAlumnoByCI(aluCi: number, aluId: number) {
    return this.http.get(
      `${environment.url_ws}/existeAlumnoByCi?aluCi=${aluCi}&aluId=${aluId}`
    );
  }

  alumnoYaAsignado(aluNro: number) {
    const fechaClaseStr = localStorage.getItem('fechaClase').substring(0, 10);
    const horaClaseStr = localStorage.getItem('horaClase');
    const movilCodStr = localStorage.getItem('movilCod');

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

  obtenerAlumnos = (pageSize: number, pageNumber: number, filtro: string) =>
    this.http.get<AlumnoResponse>(
      `${environment.url_ws}/wsGetAlumnos?PageSize=${pageSize}&PageNumber=${pageNumber}&Filtro=${filtro}`
    );

  obtenerAlumnoByCI = (ci: number) =>
    this.http.get<any>(`${environment.url_ws}/wsGetAlumnoByCI?CI=${ci}`);

  gestionAlumno(mode: string, alumno: Alumno) {
    return this.http.post(`${environment.url_ws}/wsGestionAlumno`, {
      Alumno: {
        Mode: mode,
        Alumno: alumno,
      },
    });
  }

  ingresarExamenMedico(
    aluId: number,
    tipCurId: number,
    escAluCurId: number,
    escAluCurFechaExamenMedico: string
  ) {
    return this.http.post(`${environment.url_ws}/wsIngresarExamenMedico`, {
      AluId: aluId,
      TipCurId: tipCurId,
      EscAluCurId: escAluCurId,
      EscAluCurFechaExamenMedico: escAluCurFechaExamenMedico,
    });
  }

  getAlumnoNumero() {
    return this.http.get(`${environment.url_ws}/wsGetUltimoNumeroAlumno`);
  }

  getCuentaCorriente = (alumnoNumero: number) =>
    this.http.get<CuentaCorriente[]>(
      `${environment.url_ws}/wsGetCuentaCorriente?alumnoNumero=${alumnoNumero}`
    );

  tieneFacturaPendienteAnteriorAHoy = (aluId: number) =>
    this.http.get<{ tieneFacturaPendienteAnteriorAHoy: boolean }>(
      `${environment.url_ws}/tieneFacturaPendienteAnteriorAHoy?&aluId=${aluId}`
    );

  obtenerDisponibilidadPorAlumno = (aluId: number) =>
    this.http.get<Inscripcion>(
      `${environment.url_ws}/wsGetDisponibilidadAlumno?AluId=${aluId}`
    );

  getExamenMedico(aluId: number, tipCurId: number, escAluCurId: number) {
    return this.http.post(`${environment.url_ws}/wsGetExamenMedico`, {
      AluId: aluId,
      TipCurId: tipCurId,
      EscAluCurId: escAluCurId,
    });
  }

  getClasesByAlumno(aluId: number) {
    return this.http.post(`${environment.url_ws}/getClasesByAlumno`, {
      ALUID: aluId,
    });
  }

  crearClasesAlumnoSuspension = (alumnoSuspension: AlumnoSuspension) =>
    this.http.post<ResponseSDTCustom>(
      `${environment.url_ws}/crearClasesAlumnoSuspension`,
      {
        alumnoSuspension,
      }
    );

  getClasesSuspendidasByAlumno = (aluId: number) =>
    this.http.get<ClaseSuspendida[]>(
      `${environment.url_ws}/getClasesSuspendidasPorAlumno?aluId=${aluId}`
    );

  setClasesRestauradas = (aluId: number, fecha: Date, tipCurId: number) =>
    this.http.post<boolean>(`${environment.url_ws}/setClasesRestauradas`, {
      aluId,
      fecha,
      tipCurId,
    });
}
