import { InstructorItem } from './../model/instructor.model';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Instructor } from '../model/instructor.model';
import { AgendaClase } from '../model/agenda-clase.model';
import { InscripcionCurso } from '../model/inscripcion-curso.model';
import { BloquearHoras } from '../model/bloquear-horas.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private instructorDataSource = new BehaviorSubject({
    modo: 'INS',
    instructor: {},
    id: 0,
  });
  instructorCurrentData = this.instructorDataSource.asObservable();

  constructor(private http: HttpClient) {}

  licenciaInstructor = (insId: string) =>
    this.http.post(`${environment.url_ws}/wsLicenciaInstructor`, {
      NroInstructor: insId,
      FchClase: localStorage.getItem('fechaClase'),
    });

  instructorYaAsignado(insId: string) {
    const fechaClaseStr = localStorage.getItem('fechaClase').substring(0, 10);
    const horaClaseStr = localStorage.getItem('horaClase');
    const movilCodStr = localStorage.getItem('movilCod');

    const horaClase = parseInt(horaClaseStr, 10);
    const movilCod = parseInt(movilCodStr, 10);

    return this.http.post(`${environment.url_ws}/wsInstructorYaAsignado`, {
      NroInstructor: insId,
      FchClase: fechaClaseStr,
      HorClase: horaClase,
      EscMovCod: movilCod,
    });
  }

  getDisponibilidadInstructor = (clase: AgendaClase, cantidad: number) =>
    this.http.post(`${environment.url_ws}/obtenerDisponibilidadPorInstructor`, {
      AgendaClase: clase,
      countClasesEstimar: cantidad,
    });

  getDisponibilidadInstructoresPorCantidad = (
    inscripcion: InscripcionCurso,
    paramEscInsId: string,
    cantidad: number
  ) =>
    this.http.post(
      `${environment.url_ws}/obtenerDisponibilidadInstructorPorCantidad`,
      {
        inscripcion,
        paramEscInsId,
        countClasesEstimar: cantidad,
      }
    );

  getDisponibilidadInstructoresPorCantidadCharp(
    inscripcion: InscripcionCurso,
    paramEscInsId: string,
    cantidad: number
  ) {
    let objeto = {
      inscripcion: inscripcion,
      paramEscInsId: paramEscInsId,
      countClasesEstimar: cantidad,
    };
    return this.http.post(
      `${environment.url_Backend_Charp}/Instructor/ObtenerDisponibilidadInstructorPorCantidad`,
      objeto
    );
  }

  gestionInstructor = (mode: string, instructor: Instructor) =>
    this.http.post(`${environment.url_ws}/wsGestionInstructor`, {
      Instructor: {
        Mode: mode,
        Instructor: instructor,
        usrId: localStorage.getItem('usrId'),
      },
    });

  // EliminarAusenciaInstructorAgenda = (
  //   escInsId,
  //   itemSDTInstructor: InstructorItem
  // ) =>
  //   this.http.post(`${environment.url_ws}/wsEliminarAusenciaInstructorAgenda`, {
  //     escInsId,
  //     itemSDTInstructor,
  //     usrId: localStorage.getItem('usrId'),
  //   });

  EliminarAusenciaInstructorAgenda(
    escInsId,
    itemSDTInstructor: InstructorItem
  ) {
    let objeto = {
      escInsId: escInsId,
      itemSDTInstructor: itemSDTInstructor,
      usrId: localStorage.getItem('usrId'),
    };

    return this.http.post(
      `${environment.url_Backend_Charp}/Instructor/EliminarAusenciaInstructorAgenda`,
      objeto
    );
  }

  getInstructores = () =>
    this.http.get(`${environment.url_ws}/wsGetInstructores`);

  getInstructoresActivos = () =>
    this.http.get(`${environment.url_ws}/wsGetInstructoresActivos`);

  getClasesEstimadas = (inscripcion: InscripcionCurso) =>
    this.http.post(`${environment.url_ws}/obtenerDisponibilidadInstructor`, {
      GenerarInscripcion: inscripcion,
    });

  bloquearHoras = (bloquearHoras: BloquearHoras) =>
    this.http.post<{ mensajes: string[] }>(
      `${environment.url_ws}/wsBloquearHorasAgenda`,
      { bloquearHoras }
    );

  sendDataInstructor(modo: string, instructor: Instructor, id?: number) {
    const data: { modo: string; instructor: Instructor; id: number } = id
      ? { modo, instructor, id }
      : { modo, instructor, id: 0 };
    this.instructorDataSource.next(data);
  }

  altaHoraTeorico = (req: any) =>
    this.http.post(
      `${environment.url_Backend_Charp}/Instructor/altaHoraTeorico`,
      req
    );
}
