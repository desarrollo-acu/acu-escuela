import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CopiarMoverParameters } from '../model/copiarMoverParameters.model';
import { AgendaCurso } from 'src/app/escuela/components/modals/agenda-curso/agenda-curso.component';
import { CuotaSocial } from '../model/cuotaSocial.model';
import { InscripcionCurso } from '@core/model/inscripcion-curso.model';
import { Alumno } from '@core/model/alumno.model';


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
  providedIn: 'root'
})
export class AcuService {

  xmlhttp = new XMLHttpRequest();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  httOptionsXml = {
    headers: new HttpHeaders({
      'Content-Type': 'application/soap+xml'
    })
  };

  constructor(
    private http: HttpClient) {
  }

  getTablaAgenda() {
    return this.http.post(`${environment.url_ws}/wsObtenerTablaAgenda`, {}, this.httpOptions)
      .subscribe((res: any) => {
        console.log('res: ', res);
        console.log('res.TablaAgenda', res.TablaAgenda);

        // return response.json();
      });
  }


  getClaseAgenda(fechaClase: string, horaClase: number, movCod: number) {
    return this.http.post(`${environment.url_ws}/wsObtenerAgendaClase`, {
      FechaClase: fechaClase,
      HoraClase: horaClase,
      MovCod: movCod
    }, this.httpOptions);

  }

  getInstructorAgenda(fechaClase: string, horaClase: number, EscInsId: string) {
    return this.http.post(`${environment.url_ws}/wsObtenerInstructorAgenda`, {
      Fecha: fechaClase,
      Hora: horaClase,
      EscInsId
    }, this.httpOptions);

  }

  getAgenda() {
    return this.http.post(`${environment.url_ws}/wsObtenerTablaAgenda`, {});
  }

  getAgendaPorFecha(fecha: any, tipo: string) {
    return this.http.post(`${environment.url_ws}/wsObtenerAgendaPorFecha`, {
      fecha,
      tipo
    });
  }

  validarCopiarMoverClase(fechaClase: string, horaClase: number, movCod: number) {
    return this.http.post(`${environment.url_ws}/WSValidarCopiarMoverClase`, {
      FchClase: fechaClase,
      MovCod: movCod,
      Hora: horaClase
    }, this.httpOptions);

  }

  duplicarDiaAgenda(params: DuplicarDiaParameters) {
    return this.http.post(`${environment.url_ws}/wsDuplicarDiaAgenda`, {
      FchClase: params.fechaClase,
      FechaNueva: params.fechaNueva,
      EsAgCuAviso: params.EsAgCuAviso
    }, this.httpOptions);

  }

  moverDiaAgenda(params: DuplicarDiaParameters) {
    return this.http.post(`${environment.url_ws}/wsMoverDiaAgenda`, {
      FchClase: params.fechaClase,
      FechaNueva: params.fechaNueva,
      EsAgCuAviso: params.EsAgCuAviso
    }, this.httpOptions);

  }

  liberarDiaAgenda(FchClase: Date) {
    return this.http.post(`${environment.url_ws}/wsLiberarDiaAgenda`, {
      FchClase
    }, this.httpOptions);

  }

  copiarMoverClase(params: CopiarMoverParameters) {
    return this.http.post(`${environment.url_ws}/WSCopiarMoverClase`, {
      Accion: params.accion,
      FchClaseOld: params.fechaClaseOld,
      HorClaseOld: params.horaClaseOld,
      MovilOld: params.movilOld,
      FchClase: params.fechaClase,
      HorClase: params.horaClase,
      Movil: params.movil
    }, this.httpOptions);

  }

  liberarClase(params: LiberarParameters) {
    return this.http.post(`${environment.url_ws}/wsLiberarClase`, {
      FchClase: params.fechaClase,
      HorClase: params.horaClase,
      Movil: params.movil
    }, this.httpOptions);

  }

  alumnoYaAsignado(aluNro: number) {


    const fechaClaseStr = localStorage.getItem('fechaClase').substring(0, 10);
    const horaClaseStr = localStorage.getItem('horaClase');
    const movilCodStr = localStorage.getItem('movilCod');

    const fechaClase = Date.parse(fechaClaseStr);
    const horaClase = parseInt(horaClaseStr, 10);
    const movilCod = parseInt(movilCodStr, 10);

    console.log('parametros: ');
    console.log(' AluNro: ', aluNro);
    console.log(' fechaClase: ', fechaClase);
    console.log(' horaClase: ', horaClase);
    console.log(' movCod: ', movilCod);

    console.log('fechaClaseStr: ', fechaClaseStr);


    return this.http.post(`${environment.url_ws}/wsAlumnoYaAsignado`, {

      AluNro: aluNro,
      FchClase: fechaClaseStr,
      HorClase: horaClase,
      EscMovCod: movilCod
    });
  }

  getClasesEstimadas(inscripcion: InscripcionCurso) {
    console.log('inscripción: ', inscripcion);
    return this.http.post(`${environment.url_ws}/obtenerDisponibilidadInstructor`, {
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
        fechaClaseEstimada: inscripcion.fechaClaseEstimada
      }
    });
  }

  iniciarSesion(UsrId: string, Pass: string) {
    console.log('User: ', UsrId);
    console.log('Pass: ', Pass);

    return this.http.post(`${environment.url_ws}/wsInicioEscuela`, {
      UsrId,
      Pass
    });

  }

  alumnoTieneExcepcion(aluNro: number) {

    const fechaClaseStr = localStorage.getItem('fechaClase').substring(0, 10);
    const horaClaseStr = localStorage.getItem('horaClase');
    const movilCodStr = localStorage.getItem('movilCod');

    const fechaClase = Date.parse(fechaClaseStr);
    const horaClase = parseInt(horaClaseStr, 10);

    console.log('aluNro: ', aluNro);
    console.log('fechaClaseStr: ', fechaClaseStr);
    console.log('horaClase: ', horaClase);
    console.log('fechaClase: ', fechaClase);
    return this.http.post(`${environment.url_ws}/wsAlumnoTieneExcepcion`, {
      AluNro: aluNro,
      FchClase: fechaClaseStr,
      HorClase: horaClase
    });
  }


  existeAlumno(aluNro: number) {
    return this.http.post(`${environment.url_ws}/wsExisteAlumno`, {
      AluNro: aluNro
    });
  }

  licenciaInstructor(insId: string) {

    const fechaClaseStr = localStorage.getItem('fechaClase');
    console.log('fechastr: ', fechaClaseStr);
    const fechaClase = Date.parse(fechaClaseStr);
    console.log('fechaClase: ', fechaClase);
    return this.http.post(`${environment.url_ws}/wsLicenciaInstructor`, {
      NroInstructor: insId,
      FchClase: fechaClaseStr
    });
  }

  instructorYaAsignado(insId: string) {

    const fechaClaseStr = localStorage.getItem('fechaClase').substring(0, 10);
    const horaClaseStr = localStorage.getItem('horaClase');
    const movilCodStr = localStorage.getItem('movilCod');

    const fechaClase = Date.parse(fechaClaseStr);
    const horaClase = parseInt(horaClaseStr, 10);
    const movilCod = parseInt(movilCodStr, 10);
    console.log('insId: ', insId);
    console.log('fechaClaseStr: ', fechaClaseStr);
    console.log('horaClase: ', horaClase);
    console.log('movilCod: ', movilCod);
    console.log('fechaClase: ', fechaClase);
    return this.http.post(`${environment.url_ws}/wsInstructorYaAsignado`, {
      NroInstructor: insId,
      FchClase: fechaClaseStr,
      HorClase: horaClase,
      EscMovCod: movilCod
    });
  }

  getAlumnos() {
    return this.http.post(`${environment.url_ws}/wsObtenerAlumnos`, {});
  }

  getItemsPorCurso(cursoId: number) {
    return this.http.get(`${environment.url_ws}/wsGetItemsPorCurso?TipCurId=${cursoId}`);
  }

  generarInscripcion(inscripcion: InscripcionCurso) {
    console.log('inscripción: ', inscripcion);
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
      }
    });
  }
  obtenerAlumnos(pageSize: number, pageNumber: number, filtro: string) {
    return this.http.get(`${environment.url_ws}/wsGetAlumnos?PageSize=${pageSize}&PageNumber=${pageNumber}&Filtro=${filtro}`);
  }

  gestionAlumno(mode: string, alumno: Alumno) {
    return this.http.post(`${environment.url_ws}/wsGestionAlumno`, {
      Alumno: {
        Mode: mode,
        Alumno: alumno
      }
    });
  }

  getCursos() {
    return this.http.get(`${environment.url_ws}/wsGetCursos`);
    // return this.http.post(`${environment.url_ws}/wsObtenerCursos`, {});
  }

  getCurso(TipCurId) {
    return this.http.get(`${environment.url_ws}/wsGetCurso?TipCurId=${TipCurId}`);

    // return this.http.post(`${environment.url_ws}/wsObtenerCurso`, { TipCurId });

  }

  getDepartamentos() {
    return this.http.get(`${environment.url_ws}/wsGetDepartamentos`);
  }

  guardarAgendaInstructor(agendaCurso: AgendaCurso) {
    return this.http.post(`${environment.url_ws}/wsGuardarAgendaInstructor`, {
      agendaCurso
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
    console.log('url: ', url);

    return this.http.get(url);
  }

  getFacturasPendientes(socId: number) {

    return this.http.get(`${environment.url_ws}/wsGetCuotasSociales?SocId=${socId}`);
    // return this.http.get(`${environment.url_ws}/wsGetFacturasPendientes?PageSize=${cantidad}&PageNumber=${page}&SocId=${socId}`);
  }

  getInstructores() {
    return this.http.post(`${environment.url_ws}/wsObtenerInstructores`, {});
  }


  facturarCuotasSociales(cuotasSociales: CuotaSocial) {
    return this.http.post(`${environment.url_ws}/wsFacturarCuotasSociales`, {
      cuotasSociales
    });

  }

  cleanStorageAgenda() {
    localStorage.removeItem('copiarMoverParameters');
    localStorage.removeItem('mainParameters');
    localStorage.removeItem('limpiarCeldaOld');


  }

}



function xml2json(xml) {
  try {
    let obj = {};
    if (xml.children.length > 0) {
      for (let i = 0; i < xml.children.length; i++) {
        const item = xml.children.item(i);
        const nodeName = item.nodeName;

        if (typeof (obj[nodeName]) === 'undefined') {
          obj[nodeName] = xml2json(item);
        } else {
          if (typeof (obj[nodeName].push) === 'undefined') {
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
    console.log(e.message);
  }
}
