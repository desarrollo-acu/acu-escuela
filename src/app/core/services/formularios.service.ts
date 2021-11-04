import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Formularios, FormulariosType } from '../model/formularios/formularios.model';
import { Form } from '@angular/forms';
import { DesperfectoMovil } from '../model/formularios/desperfecto-movil.model';
import { DiarioMovil } from '../model/formularios/diario-movil.model';
import { EvaluacionAlumno } from '../model/formularios/evaluacion-alumno.model';
import { ResultadoExamenPractico } from '../model/formularios/resultado-examen-practico.model';

@Injectable({
  providedIn: 'root',
})
export class FormulariosService {
  private formularios = new BehaviorSubject<Formularios>({
    desperfectoMovil: [],
    diarioMovil: [],
    evaluacionAlumno: [],
    resultadoExamenPractico: [],
  });

  formularios$: Observable<Formularios>;

  constructor(private http: HttpClient) {
    this.formularios$ = this.formularios.asObservable();
  }

  getFormularios(): Formularios {
    return this.formularios.getValue();
  }

  setFormularios( type:FormulariosType, formularios: any[]) {
    this.formularios.next({...this.getFormularios(), [type]: [...formularios]});
  }

  /** Desperfecto Movil   **/
  getDesperfectoMovil = () =>
    this.http.get<DesperfectoMovil[]>(`${environment.apiFormularios}/desperfectomovil`);

  getDesperfectoMovilById = (id: number) =>
    this.http.get<DesperfectoMovil>(`${environment.apiFormularios}/desperfectomovil/${id}`);

  getDesperfectoMovilByMovil = (movil: number) =>
    this.http.get<DesperfectoMovil[]>(
      `${environment.apiFormularios}/desperfectomovil/movil/${movil}`
    );

  getDesperfectoByInstructor = (instructor: string) =>
    this.http.get<DesperfectoMovil[]>(
      `${environment.apiFormularios}/desperfectomovil/instructor/${instructor}`
    );

  /** Diario Movil   **/
  getDiarioMovil = () =>
    this.http.get<DiarioMovil[]>(`${environment.apiFormularios}/diariomovil`);

  getDiarioMovilById = (id: number) =>
    this.http.get<DiarioMovil>(`${environment.apiFormularios}/diariomovil/${id}`);

  getDiarioMovilByMovil = (movil: number) =>
    this.http.get<DiarioMovil[]>(`${environment.apiFormularios}/diariomovil/movil/${movil}`);

  getDiarioMovilByInstructor = (instructor: string) =>
    this.http.get<DiarioMovil[]>(
      `${environment.apiFormularios}/diariomovil/instructor/${instructor}`
    );

  getExcelDiarioMovil = (ids: number[]) => this.http.post(`${environment.apiFormularios}/diariomovil/excel`, ids);

  /** Evaluacion Alumno   **/
  getEvaluacionAlumno = () =>
    this.http.get<EvaluacionAlumno[]>(`${environment.apiFormularios}/evaluacionalumno`);

  getEvaluacionAlumnoByInstructor = (instructor: string) =>
    this.http.get<EvaluacionAlumno[]>(
      `${environment.apiFormularios}/evaluacionalumno/instructor/${instructor}`
    );

  /** Resultado Examen Practico   **/
  getResultadoExamenPractico = () =>
    this.http.get<ResultadoExamenPractico[]>(`${environment.apiFormularios}/resultadoexamenpractico`);

  getResultadoExamenPracticoByInstructor = (instructor: string) =>
    this.http.get<ResultadoExamenPractico[]>(
      `${environment.apiFormularios}/resultadoexamenpractico/instructor/${instructor}`
    );
}
