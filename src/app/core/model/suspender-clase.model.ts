import { AgendaClase } from './agenda-clase.model';
export interface Suspenderclase {
  reagendaClase?: boolean;
  nuevaFecha?: string;
  nuevaHoraInicio?: number;
  nuevaHoraFin?: number;
  claseAnterior?: AgendaClase;
  usrId?: string;
}
