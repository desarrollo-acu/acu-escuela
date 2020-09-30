import { AgendaClase } from './agenda-clase.model';
import { ClaseEstimadaDetalle } from './clase-estimada.model';

export interface GenerarExamen {
  alumnoVaADarExamen?: number;
  cursoParaExamen?: number;
  observacionesExamen?: string;
  claseAnterior?: AgendaClase;
  examenConCosto?: boolean;
  instructorSeleccionado?: number;
  movilSeleccionado?: number;
  nuevaFecha?: string;
  nuevaHoraInicio?: number;
  nuevaHoraFin?: number;
  reagendaClase?: boolean;
  EscAluCurId?: number;
  usrId?: string;
  reservarClasePrevia?: boolean;

  clasesAReagendar?: GenerarExamenItems[];
}

export interface GenerarExamenItems {
  detalle?: ClaseEstimadaDetalle;
  clasePrevia?: AgendaClase;
}
