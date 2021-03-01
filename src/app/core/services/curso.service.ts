import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Curso } from '../model/curso.model';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  // esto va al cursoService
  private cursoDataSource = new BehaviorSubject({
    modo: 'INS',
    curso: {},
    id: 0,
  });

  cursoCurrentData = this.cursoDataSource.asObservable();

  constructor(private http: HttpClient) {}

  sendDataCurso(modo: string, curso: Curso, id?: number) {
    const data: { modo: string; curso: Curso; id: number } = id
      ? { modo, curso, id }
      : { modo, curso, id: 0 };
    this.cursoDataSource.next(data);
  }

  getItemsPorCurso(cursoId: number) {
    return this.http.get(
      `${environment.url_ws}/wsGetItemsPorCurso?TipCurId=${cursoId}`
    );
  }

  gestionCurso(modo: string, curso: Curso) {
    return this.http.post(`${environment.url_ws}/wsGestionCurso`, {
      modo,
      curso,
    });
  }

  getCursos() {
    return this.http.get(`${environment.url_ws}/wsGetCursos`);
  }

  getCurso(TipCurId) {
    return this.http.get(
      `${environment.url_ws}/wsGetCurso?TipCurId=${TipCurId}`
    );
  }

  getUltimoCursoId() {
    return this.http
      .get(`${environment.url_ws}/wsGetUltimoCursoId`)
      .pipe(map((curso: { Cursoid: number }) => Number(curso.Cursoid)));
  }

  testExcel() {
    // window.open(`${environment.url_ws}/ExportWWTEscAgeInstructor`, "_blank");

    const headers = new HttpHeaders();
    headers.set('Aceppt', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // {responseType: 'arraybuffer'}
    return this.http.post(
      `${environment.url_ws}/ExportWWTEscAgeInstructor`,
      { UsrId: 'superviso2', Mes: 10, Anio: 2021 }
    );
  }
}
