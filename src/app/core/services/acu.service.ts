/*
Este Servicio contiene las funcionalidades de las agendas, principalmente.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CopiarMoverParameters } from '../model/copiarMoverParameters.model';
import { AgendaCurso } from 'src/app/escuela/components/modals/agenda-curso/agenda-curso.component';
import { CuotaSocial } from '../model/cuotaSocial.model';

import { AgendaClase } from '@core/model/agenda-clase.model';
import { ClaseEstimada } from '../model/clase-estimada.model';
import { Suspenderclase } from '../model/suspender-clase.model';
import { map } from 'rxjs/operators';
import { EnvioNotificacion } from '../model/envio-notificacion.model';

export interface LiberarParameters {
  fechaClase: Date;
  horaClase: number;
  movil: number;
}

export interface DuplicarDiaParameters {
  fechaClase: Date;
  fechaNueva: Date;
  EsAgCuAviso: number;
}
@Injectable({
  providedIn: 'root',
})
export class AcuService {
  xmlhttp = new XMLHttpRequest();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  httOptionsXml = {
    headers: new HttpHeaders({
      'Content-Type': 'application/soap+xml',
    }),
  };

  constructor(private http: HttpClient) {}

  getTablaAgenda() {
    return this.http
      .post(`${environment.url_ws}/wsObtenerTablaAgenda`, {}, this.httpOptions)
      .subscribe((res: any) => {
        // return response.json();
      });
  }

  getClaseAgenda(fechaClase: string, horaClase: number, movCod: number) {
    return this.http.post(
      `${environment.url_ws}/wsObtenerAgendaClase`,
      {
        FechaClase: fechaClase,
        HoraClase: horaClase,
        MovCod: movCod,
      },
      this.httpOptions
    );
  }

  getInstructorAgenda(fechaClase: string, horaClase: number, EscInsId: string) {
    return this.http.post(
      `${environment.url_ws}/wsObtenerInstructorAgenda`,
      {
        Fecha: fechaClase,
        Hora: horaClase,
        EscInsId,
      },
      this.httpOptions
    );
  }

  getAgenda() {
    return this.http.post(`${environment.url_ws}/wsObtenerTablaAgenda`, {});
  }

  getAgendaPorFecha(fecha: any, tipo: string) {
    return this.http.post(`${environment.url_ws}/wsObtenerAgendaPorFecha`, {
      fecha,
      tipo,
    });
  }

  validarCopiarMoverClase(
    fechaClase: string,
    horaClase: number,
    movCod: number
  ) {
    return this.http.post(
      `${environment.url_ws}/WSValidarCopiarMoverClase`,
      {
        FchClase: fechaClase,
        MovCod: movCod,
        Hora: horaClase,
      },
      this.httpOptions
    );
  }

  duplicarDiaAgenda(params: DuplicarDiaParameters) {
    return this.http.post(
      `${environment.url_ws}/wsDuplicarDiaAgenda`,
      {
        FchClase: params.fechaClase,
        FechaNueva: params.fechaNueva,
        EsAgCuAviso: params.EsAgCuAviso,
      },
      this.httpOptions
    );
  }

  moverDiaAgenda(params: DuplicarDiaParameters) {
    return this.http.post(
      `${environment.url_ws}/wsMoverDiaAgenda`,
      {
        FchClase: params.fechaClase,
        FechaNueva: params.fechaNueva,
        EsAgCuAviso: params.EsAgCuAviso,
      },
      this.httpOptions
    );
  }

  liberarDiaAgenda(FchClase: Date) {
    return this.http.post(
      `${environment.url_ws}/wsLiberarDiaAgenda`,
      {
        FchClase,
      },
      this.httpOptions
    );
  }

  copiarMoverClase(params: CopiarMoverParameters) {
    return this.http.post(
      `${environment.url_ws}/WSCopiarMoverClase`,
      {
        Accion: params.accion,
        FchClaseOld: params.fechaClaseOld,
        HorClaseOld: params.horaClaseOld,
        MovilOld: params.movilOld,
        FchClase: params.fechaClase,
        HorClase: params.horaClase,
        Movil: params.movil,
      },
      this.httpOptions
    );
  }


  copiarMoverInstructorClase(params: CopiarMoverParameters) {
    return this.http.post(
      `${environment.url_ws}/wsCopiarMoverInstructorClase`,
      {
        CopiarMoverInstructorClase: {
          Accion: params.accion,
          FchClaseOld: params.fechaClaseOld,
          HorClaseOld: params.horaClaseOld,
          MovilOld: params.movilOld,
          FchClase: params.fechaClase,
          HorClase: params.horaClase,
          Movil: params.movil,
          EscInsId : params.escInsId,
          EscInsIdOld : params.escInsIdOld,
          EsMovil: params.esMovil,
          UserId: params.userId,

        }
      },
      this.httpOptions
    );
  }

  liberarClase(params: LiberarParameters) {
    return this.http.post(
      `${environment.url_ws}/wsLiberarClase`,
      {
        FchClase: params.fechaClase,
        HorClase: params.horaClase,
        Movil: params.movil,
      },
      this.httpOptions
    );
  }

  getItems() {
    return this.http.get(`${environment.url_ws}/wsGetItems`);
  }

  getItem(itemCod: number) {
    return this.http.get(`${environment.url_ws}/wsGetItems?ItemCod=${itemCod}`);
  }

  suspenderClase(claseAnterior: AgendaClase, nuevaClase?: any) {
    const SuspenderClase: Suspenderclase = {
      reagendaClase: false,
      claseAnterior,
      usrId: localStorage.getItem('usrId'),
    };
    if (nuevaClase) {
      SuspenderClase.reagendaClase = true;
      SuspenderClase.nuevaFecha = nuevaClase.Fecha;
      SuspenderClase.nuevaHoraInicio = nuevaClase.HoraInicio;
      SuspenderClase.nuevaHoraFin = nuevaClase.HoraFin;
    }

    return this.http.post(`${environment.url_ws}/wsSuspenderClase`, {
      SuspenderClase,
    });
  }

  getEscuelaEstados() {
    return this.http.get(`${environment.url_ws}/wsGetEscuelaEstados`);
    // return this.http.post(`${environment.url_ws}/wsObtenerCursos`, {});
  }

  getDepartamentos() {
    return this.http.get(`${environment.url_ws}/wsGetDepartamentos`);
  }

  guardarAgendaInstructor(agendaCurso: AgendaCurso) {
    return this.http.post(`${environment.url_ws}/wsGuardarAgendaInstructor`, {
      agendaCurso,
    });
  }

  guardarAgendaClase(agendaClase: AgendaClase) {
    return this.http.post(`${environment.url_ws}/wsGuardarAgendaClase`, {
      agendaClase,
    });
  }

  getSocio(SocId) {
    return this.http.get(`${environment.url_ws}/wsGetSDTSocio?SocId=${SocId}`);
  }

  getSocios(cantidad: number, page: number, tipo: string, filtro: number) {
    let url = `${environment.url_ws}/wsGetSDTSocios?PageSize=${cantidad}&PageNumber=${page}&Tipo=${tipo}`;
    if (filtro) {
      url += `&Filtro=${filtro}`;
    }

    return this.http.get(url);
  }

  getFacturasPendientes(socId: number) {
    return this.http.get(
      `${environment.url_ws}/wsGetCuotasSociales?SocId=${socId}`
    );
    // return this.http.get(`${environment.url_ws}/wsGetFacturasPendientes?PageSize=${cantidad}&PageNumber=${page}&SocId=${socId}`);
  }

  facturarCuotasSociales(cuotasSociales: CuotaSocial) {
    return this.http.post(`${environment.url_ws}/wsFacturarCuotasSociales`, {
      cuotasSociales,
    });
  }

  getPDFPlanDeClases(planDeClase: ClaseEstimada) {
    const headers = new HttpHeaders();
    headers.set('Aceppt', 'application/pdf;');

    return this.http.post(
      `${environment.url_ws}/wsPDFPlanDeClases`,
      {
        PlanDeClase: planDeClase,
      },
      {
        headers,
        responseType: 'blob' as 'json',
      }
    );
  }

  cleanStorageAgenda() {
    localStorage.removeItem('copiarMoverParameters');
    localStorage.removeItem('mainParameters');
    localStorage.removeItem('limpiarCeldaOld');
    localStorage.removeItem('pegar-clase');

    localStorage.removeItem('fechaClase');
    localStorage.removeItem('fecha');
    localStorage.removeItem('instructor');
    localStorage.removeItem('movil');
    localStorage.removeItem('hora');
    localStorage.removeItem('existe');
    localStorage.removeItem('tipoAgenda');
  }

  enviarNotificacion(envioNotificacion: EnvioNotificacion) {
    return this.http.post(`${environment.url_ws}/wsEnvioNotificacion`, {
      envioNotificacion,
    });
  }
  // test ws

  testWsLogicsat() {
    const headers = new HttpHeaders();

    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return this.http.post(
      `http://api.logicsat.com/logicsat/rest/WSGetServicios`,
      `
    {
    "WSAutorizacion": {
        "Guid": "0a9ee8b9-8cf8-4e95-933c-35194d2f0559",
        "Usuario": "api@acu.com",
        "Password": "apiacu2020"
    },
    "WSSDTFiltroServicio": {
        "Id": "",
        "SuperiorId": "0",
        "IdExterno": "",
        "NroServicio": "",
        "NroAsistencia": "",
        "Estado": "",
        "FechaLlamadaInicial": "15-09-2020 00:00:00",
        "FechaLlamadaFinal": "16-09-2020 23:59:00",
        "Procedencia": "",
        "Prestador": "",
        "Movil": "",
        "Operador": "",
        "Telefonista": "",
        "Prestacion": "",
        "Causa": "",
        "SubCausa": "",
        "Motivo": "",
        "Pais": "",
        "Departamento": "",
        "Ciudad": "",
        "Zona": "",
        "NroTracking": ""
    }
}
    `,
      { headers }
    );
  }
}

function xml2json(xml) {
  try {
    let obj = {};
    if (xml.children.length > 0) {
      for (let i = 0; i < xml.children.length; i++) {
        const item = xml.children.item(i);
        const nodeName = item.nodeName;

        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = xml2json(item);
        } else {
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];

            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xml2json(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
    console.error(e.message);
  }
}
