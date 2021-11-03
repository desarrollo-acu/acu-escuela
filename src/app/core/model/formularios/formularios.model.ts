import { DesperfectoMovil } from './desperfecto-movil.model';
import { DiarioMovil } from './diario-movil.model';
import { EvaluacionAlumno } from './evaluacion-alumno.model';
import { ResultadoExamenPractico } from './resultado-examen-practico.model';

export interface Formularios{
  desperfectoMovil?: DesperfectoMovil[],
  diarioMovil?: DiarioMovil[],
  evaluacionAlumno?: EvaluacionAlumno[],
  resultadoExamenPractico?: ResultadoExamenPractico[]
}


export type FormulariosType = 'desperfectoMovil' | 'diarioMovil' | 'evaluacionAlumno' | 'resultadoExamenPractico';
