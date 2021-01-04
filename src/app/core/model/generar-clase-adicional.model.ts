import { AgendaClase } from './agenda-clase.model';


export interface GenerarClaseAdicional {
  fecha?: string;
  hora?: number;
  movilSeleccionado?: number;
  alumnoClaseAdicional?: number;
  cursoClaseAdicional?: number;
  instructorSeleccionado?: number;
  observacionesClaseAdicional?: string;
  escAluCurId?: number;
  claseAnterior?: AgendaClase;
  usrId?: string;

}
