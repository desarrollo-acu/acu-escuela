import { AgendaClase } from './agenda-clase.model';

export interface GenerarExamen {
  alumnoVaADarExamen?: number;
  instructorSeleccionado?: number;
  cursoParaExamen?: number;
  EscAluCurId?: number;
  clasePreviaExamen?: boolean;
  observacionesExamen?: string;
  examenConCosto?: boolean;
  claseAnterior?: AgendaClase;
  nuevaClase?: string;
  reagendaClase?: boolean;
}
