import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Inscripcion } from '../model/inscripcion.model';
import { InscripcionCurso } from '../model/inscripcion-curso.model';
import { Prefactura } from '../model/prefactura.model';
import { map } from 'rxjs/operators';
import { GenerarExamen } from '../model/generar-examen.model';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  // esto va al inscripcionService
  private inscripcionDataSource = new BehaviorSubject({
    inscripcion: {},
    id: 0,
  });
  inscripcionCurrentData = this.inscripcionDataSource.asObservable();

  constructor(private http: HttpClient) {}

  sendDataInscripcion(inscripcion: Inscripcion, id?: number) {
    const data: { inscripcion: Inscripcion; id: number } = id
      ? { inscripcion, id }
      : { inscripcion, id: 0 };
    this.inscripcionDataSource.next(data);
  }

  generarExamen(generarExamen: GenerarExamen) {
    return this.http.post(`${environment.url_ws}/wsGenerarExamen`, {
      generarExamen,
    });
  }

  generarInscripcion(inscripcion: InscripcionCurso) {
    console.log('::::: inscripción: ', inscripcion);
    console.log('::::: sede: ', inscripcion.sede);
    console.log('::::: escCurFchIns: ', inscripcion.escCurFchIns);

    return this.http.post(`${environment.url_ws}/wsGenerarInscripcion`, {
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
        facturaEstadoPendiente: inscripcion.facturaEstadoPendiente,
        ClasesEstimadas: inscripcion.ClasesEstimadas,
        escCurTe1: inscripcion.escCurTe1,
        escCurTe2: inscripcion.escCurTe2,
        escCurTe3: inscripcion.escCurTe3,
        escCurIni: inscripcion.escCurIni,
        escCurFchIns: inscripcion.escCurFchIns,
        sede: inscripcion.sede,
        irABuscarAlAlumno: inscripcion.irABuscarAlAlumno,
        condicionesCurso: inscripcion.condicionesCurso,
        reglamentoEscuela: inscripcion.reglamentoEscuela,
        documentosEntregadosYFirmados:
          inscripcion.documentosEntregadosYFirmados,
        eLearning: inscripcion.eLearning,
        fechaClaseEstimada: inscripcion.fechaClaseEstimada,
        usrId: localStorage.getItem('usrId'),
      },
    });
  }

  obtenerInscripciones(pageSize: number, pageNumber: number, filtro: string) {
    return this.http.get(
      `${environment.url_ws}/wsGetInscripciones?PageSize=${pageSize}&PageNumber=${pageNumber}&Filtro=${filtro}`
    );
  }

  obtenerInscripcion(aluId: number, cursoId: number) {
    return this.http.get(
      `${environment.url_ws}/wsGetInscripcion?AluId=${aluId}&TipCurId=${cursoId}`
    );
  }

  getPDFPrefactura(preFactura: Prefactura) {
    const headers = new HttpHeaders();
    headers.set('Aceppt', 'application/pdf;');

    return this.http.post(
      `${environment.url_ws}/wsImprimirPrefactura`,
      {
        preFactura,
      },
      {
        headers,
        responseType: 'blob' as 'json',
      }
    );
  }
}
