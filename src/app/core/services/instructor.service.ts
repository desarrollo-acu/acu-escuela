import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Instructor } from '../model/instructor.model';
import { AgendaClase } from '../model/agenda-clase.model';
import { InscripcionCurso } from '../model/inscripcion-curso.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  // esto va al instructorService
  private instructorDataSource = new BehaviorSubject({
    modo: 'INS',
    instructor: {},
    id: 0,
  });
  instructorCurrentData = this.instructorDataSource.asObservable();

  constructor(private http: HttpClient) {}

  licenciaInstructor(insId: string) {
    const fechaClaseStr = localStorage.getItem('fechaClase');

    return this.http.post(`${environment.url_ws}/wsLicenciaInstructor`, {
      NroInstructor: insId,
      FchClase: fechaClaseStr,
    });
  }

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

  getDisponibilidadInstructor(clase: AgendaClase, cantidad: number) {

    return this.http.post(
      `${environment.url_ws}/obtenerDisponibilidadPorInstructor`,
      {
        AgendaClase: clase,
        countClasesEstimar: cantidad,
      }
    );
  }
  getDisponibilidadInstructoresPorCantidad(inscripcion: InscripcionCurso, cantidad: number) {

    return this.http.post(
      `${environment.url_ws}/obtenerDisponibilidadInstructorPorCantidad`,
      {
        inscripcion,
        countClasesEstimar: cantidad,
      }
    );
  }

  gestionInstructor(mode: string, instructor: Instructor) {
    return this.http.post(`${environment.url_ws}/wsGestionInstructor`, {
      Instructor: {
        Mode: mode,
        Instructor: instructor,
      },
    });
  }

  getInstructores() {
    // return this.http.post(`${environment.url_ws}/wsObtenerInstructores`, {});
    return this.http.get(`${environment.url_ws}/wsGetInstructores`);
  }

  getClasesEstimadas(inscripcion: InscripcionCurso) {

    return this.http.post(
      `${environment.url_ws}/obtenerDisponibilidadInstructor`,
      {
        GenerarInscripcion: {
          FacturaRUT: inscripcion.FacturaRut,
          SeleccionarItemsFactura: inscripcion.SeleccionarItemsFactura,
          AluId: inscripcion.AluId,
          TipCurId: inscripcion.TipCurId,
          TipCurNom: inscripcion.TipCurNom,
          EscCurDet: inscripcion.EscAgeInsObservaciones,
          disponibilidadLunes: inscripcion.disponibilidadLunes,
          disponibilidadMartes: inscripcion.disponibilidadMartes,
          disponibilidadMiercoles: inscripcion.disponibilidadMiercoles,
          disponibilidadJueves: inscripcion.disponibilidadJueves,
          disponibilidadViernes: inscripcion.disponibilidadViernes,
          disponibilidadSabado: inscripcion.disponibilidadSabado,
          fechaClaseEstimada: inscripcion.fechaClaseEstimada,
        },
      }
    );
  }

  sendDataInstructor(modo: string, instructor: Instructor, id?: number) {
    const data: { modo: string; instructor: Instructor; id: number } = id
      ? { modo, instructor, id }
      : { modo, instructor, id: 0 };
    this.instructorDataSource.next(data);
  }
}
