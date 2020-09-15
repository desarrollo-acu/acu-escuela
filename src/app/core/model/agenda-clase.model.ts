import { ClaseEstimada } from './clase-estimada.model';
export interface AgendaClase {
  // FechaClase: string;
  Modo?: string;
  FechaClase?: string;
  Hora?: number;
  HoraNumero?: number;
  EscMovCod?: number;
  EsAgCuInsId?: string;
  EsAgCuInsNom?: string;
  AluId?: number;
  AluNro?: number;
  AluNomApe?: string;
  TipCurId?: number;
  TipCurNom?: string;
  EscAluCurId?: number;
  EsAgCuDet?: string;
  EsAgCuTipCla?: string;
  EsAgCuObs?: string;
  EsAgCuNroCla?: number;
  EsAgCuEst?: string;
  EsAgCuClaAdiSN?: string;
  EsAgCuAviso?: number;
  EsAgCuDetAviso?: string;
  Cursos?: string[];
  CantidadClasesPracticas?: number;
  AvisoInstructor?: string;
  EscInsId?: string;
  EscInsNom?: string;
  EscCurEmp?: string;
  EsAgCuInNoCorto?: string;
  EsAgCuEstOld?: string;
  EsAgCuAvisoOld?: number;
  EsAgCuDetAvisoOld?: string;

  disponibilidadLunes?: string[];
  disponibilidadMartes?: string[];
  disponibilidadMiercoles?: string[];
  disponibilidadJueves?: string[];
  disponibilidadViernes?: string[];
  disponibilidadSabado?: string[];
  planDeClases?: ClaseEstimada;

  UsrId?: string;
  existeClaseAgenda?: boolean;
}
