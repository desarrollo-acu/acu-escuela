import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Curso } from '../model/curso.model';
import { map } from 'rxjs/operators';

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

  sendDataCurso(modo: string, curso: Curso, id?: number) {
    const data: { modo: string; curso: Curso; id: number } = id
      ? { modo, curso, id }
      : { modo, curso, id: 0 };
    this.cursoDataSource.next(data);
  }
}
