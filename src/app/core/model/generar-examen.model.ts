import { AgendaClase } from './agenda-clase.model';

export interface GenerarExamen {
  alumnoVaADarExamen?: number;
  instructorSeleccionado?: number;
  cursoParaExamen?: number;
  clasePreviaExamen?: boolean;
  observacionesExamen?: string;
  examenConCosto?: boolean;
  claseAnterior?: AgendaClase;
}
