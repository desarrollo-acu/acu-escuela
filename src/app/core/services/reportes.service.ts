import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClaseEstimada } from '@core/model/clase-estimada.model';
import { environment } from '@environments/environment';
import { formatDateToString } from '@utils/utils-functions';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  headers = new HttpHeaders();

  options;

  constructor(private http: HttpClient, private authService: AutenticacionService) {
    this.headers.set('Aceppt', 'application/pdf;');
    this.options = {
      headers: this.headers,
      responseType: 'blob' as 'json',
    };
  }

  ocupacionInstructorPorPeriodo = () => {};

  ocupacionInstructoresPorPeriodo = () => {};

  facturacionPorItem = (codigoInicial, codigoFinal, fechaInicio, fechaFinal) =>
    this.http.post(
      `${environment.url_ws}/RListCo1`,
      { codigoInicial, codigoFinal, fechaInicio, fechaFinal },
      this.options
    );

  dataIniciosCursosPorPeriodo = (fechaInicial, fechaFinal) =>
    this.http.get(
      `${
        environment.url_ws
      }/getDataInicioCurso?fechaInicial=${formatDateToString(
        fechaInicial.toDate()
      )}&fechaFinal=${formatDateToString(fechaFinal.toDate())}`
    );

  iniciosCursosPorPeriodo = (fechaInicial, fechaFinal) =>
    this.http.post(`${environment.url_ws}/getExcelInicioCurso`, {
      fechaInicial,
      fechaFinal,
    });

  cantidadClasesPorPeriodo = (usrId, mes, anio) =>
    this.http.post(`${environment.url_ws}/PEscConClases`, { usrId, mes, anio });
  // REscClasesAlumHora
  alumnosEnCurso = (fechaDesde, fechaHasta) =>
    this.http.post(`${environment.url_ws}/REscClasesAlumHora`, {
      fechaDesde,
      fechaHasta,
    });


  getPDFPlanDeClases(planDeClase: ClaseEstimada, path = 'wsPDFPlanDeClases') {
    const headers = new HttpHeaders();
    headers.set('Aceppt', 'application/pdf;');
    console.log( this.authService.getUserId() );

    return this.http.post(
      `${environment.url_ws}/${path}`,
      {
        PlanDeClase: {...planDeClase, UsrId: this.authService.getUserId()},
      },
      {
        headers,
        responseType: 'blob' as 'json',
      }
    );
  }
}
