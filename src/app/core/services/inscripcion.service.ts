import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Inscripcion } from '../model/inscripcion.model';
import { InscripcionCurso } from '../model/inscripcion-curso.model';
import { Prefactura } from '../model/prefactura.model';
import { map } from 'rxjs/operators';
import { GenerarExamen } from '../model/generar-examen.model';
import { ResponseSDTCustom } from '../model/response-sdt-custom.model';
import { Examen } from '../model/examen.model';
import { GenerarClaseAdicional } from '../model/generar-clase-adicional.model';

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

  generarExamen = (generarExamen: GenerarExamen)  => this.http.post<ResponseSDTCustom>(`${environment.url_ws}/wsGenerarExamen`, {
      generarExamen,
    });

  generarClaseAdicional = (claseAdicional: GenerarClaseAdicional)  => this.http.post<ResponseSDTCustom>(`${environment.url_ws}/wsGenerarClaseAdicional`, {
      claseAdicional,
    });

    //wsGenerarClaseAdicional

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
        examenMedico: inscripcion.examenMedico,
        licenciaCedulaIdentidad: inscripcion.licenciaCedulaIdentidad,
        pagoDeLicencia: inscripcion.pagoDeLicencia,

        fechaLicCedulaIdentidad: inscripcion.fechaLicCedulaIdentidad,
        fechaPagoLicencia: inscripcion.fechaPagoLicencia,
        fechaExamenMedico: inscripcion.fechaExamenMedico,

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

  getInscripcionesByAlumno = (alumnoId: number) => this.http.get (`${environment.url_ws}/wsGetInscripcionesByAlumno?AluId=${alumnoId}`);

  getExamenes  = () => this.http.get<Examen[]>(`${environment.url_ws}/wsGetExamenes`);

  getExamenById  = (examen: Examen) =>
    this.http.get<Examen>(`${environment.url_ws}/wsGetExamenById?aluID=${examen.ALUID}&tipCurId=${examen.TIPCURID}&escAluCurId=${examen.EscAluCurId}&escAluCurExamenId=${examen.EscAluCurExamenId}`);

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
