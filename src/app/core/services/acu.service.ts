import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CopiarMoverParameters } from '../model/copiarMoverParameters.model';
import { AgendaCurso } from 'src/app/escuela/components/modals/agenda-curso/agenda-curso.component';
import { CuotaSocial } from '../model/cuotaSocial.model';
import { InscripcionCurso } from '@core/model/inscripcion-curso.model';
import { Alumno } from '@core/model/alumno.model';
import { BehaviorSubject } from 'rxjs';
import { Curso } from '@core/model/curso.model';
import { Instructor } from '@core/model/instructor.model';
import { AgendaClase } from '@core/model/agenda-clase.model';


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

  // esto va al alumnoService
  private alumnoDataSource = new BehaviorSubject({ modo: 'INS', alumno: {}, numero: 0 });
  alumnoCurrentData = this.alumnoDataSource.asObservable();

  // esto va al cursoService
  private cursoDataSource = new BehaviorSubject({ modo: 'INS', curso: {}, id: 0 });
  cursoCurrentData = this.cursoDataSource.asObservable();

  // esto va al instructorService
  private instructorDataSource = new BehaviorSubject({ modo: 'INS', instructor: {}, id: 0 });
  instructorCurrentData = this.instructorDataSource.asObservable();


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

  getDisponibilidadInstructor(clase: AgendaClase, cantidad: number) {
    console.log('clase: ', clase);
    return this.http.post(`${environment.url_ws}/obtenerDisponibilidadPorInstructor`, {
      AgendaClase: clase,
      countClasesEstimar: cantidad
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

  getItems() {
    return this.http.get(`${environment.url_ws}/wsGetItems`);
  }

  getItem(itemCod: number) {
    return this.http.get(`${environment.url_ws}/wsGetItems?ItemCod=${itemCod}`);
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
        documentosEntregadosYFirmados: inscripcion.documentosEntregadosYFirmados,
        eLearning: inscripcion.eLearning,
        fechaClaseEstimada: inscripcion.fechaClaseEstimada,
      }
    });
  }

  suspenderClase(claseAnterior: AgendaClase, nuevaClase?: any) {
    const SuspenderClase: {
      reagendaClase?: boolean;
      nuevaFecha?: string;
      nuevaHoraInicio?: number;
      nuevaHoraFin?: number;
      claseAnterior?: AgendaClase
    } = {
      reagendaClase: false,
      claseAnterior
    };
    if (nuevaClase) {
      SuspenderClase.reagendaClase = true;
      SuspenderClase.nuevaFecha = nuevaClase.Fecha;
      SuspenderClase.nuevaHoraInicio = nuevaClase.HoraInicio;
      SuspenderClase.nuevaHoraFin = nuevaClase.HoraFin;
    }

    return this.http.post(`${environment.url_ws}/wsSuspenderClase`, {
      SuspenderClase
    });


  }

  obtenerInscripciones(pageSize: number, pageNumber: number, filtro: string) {
    return this.http.get(`${environment.url_ws}/wsGetInscripciones?PageSize=${pageSize}&PageNumber=${pageNumber}&Filtro=${filtro}`);
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

  gestionCurso(mode: string, curso: Curso) {
    return this.http.post(`${environment.url_ws}/wsGestionCurso`, {
      Curso: {
        Mode: mode,
        Curso: curso
      }
    });
  }

  gestionInstructor(mode: string, instructor: Instructor) {
    return this.http.post(`${environment.url_ws}/wsGestionInstructor`, {
      Instructor: {
        Mode: mode,
        Instructor: instructor
      }
    });
  }

  getEscuelaEstados() {
    return this.http.get(`${environment.url_ws}/wsGetEscuelaEstados`);
    // return this.http.post(`${environment.url_ws}/wsObtenerCursos`, {});
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
    // return this.http.post(`${environment.url_ws}/wsObtenerInstructores`, {});
    return this.http.get(`${environment.url_ws}/wsGetInstructores`);
  }

  getAlumnoNumero() {
    return this.http.get(`${environment.url_ws}/wsGetUltimoNumeroAlumno`);
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
    localStorage.removeItem('pegar-clase');


    localStorage.removeItem('fechaClase');
    localStorage.removeItem('fecha');
    localStorage.removeItem('instructor');
    localStorage.removeItem('movil');
    localStorage.removeItem('hora');
    localStorage.removeItem('existe');
    localStorage.removeItem('tipoAgenda');


  }

  // Test send parameters

  sendDataAlumno(modo: string, alumno: Alumno, numero?: number) {

    const data: { modo: string, alumno: Alumno, numero: number } = (numero) ? { modo, alumno, numero } : { modo, alumno, numero: 0 };
    this.alumnoDataSource.next(data);

  }

  sendDataCurso(modo: string, curso: Curso, id?: number) {

    const data: { modo: string, curso: Curso, id: number } = (id) ? { modo, curso, id } : { modo, curso, id: 0 };
    this.cursoDataSource.next(data);

  }

  sendDataInstructor(modo: string, instructor: Instructor, id?: number) {

    const data: { modo: string, instructor: Instructor, id: number } = (id) ? { modo, instructor, id } : { modo, instructor, id: 0 };
    this.instructorDataSource.next(data);

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
