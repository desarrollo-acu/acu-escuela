
export interface AgendaElement {
  Movil: string;
  Hora0: string;
  Hora1: string;
  Hora2: string;
  Hora3: string;
  Hora4: string;
  Hora5: string;
  Hora6: string;
  Hora7: string;
  Hora8: string;
  Hora9: string;
  Hora10: string;
  Hora11: string;
  Hora12: string;
  Hora13: string;
  Hora14: string;
  Hora15: string;
  Hora16: string;
  Hora17: string;
  Hora18: string;
  Hora19: string;
  Hora20: string;
  Hora21: string;
  Hora22: string;
  Hora23: string;
  Hora24: string;
}
export interface DataAgenda {
  EscInsId: any;
  TipCurNom: any;
  Hora: number;
  MovCod: number;
  Valor: string;
  Disponible: boolean;
  AluId: number;
  AluApe1: string;
  EsAgCuInsId: string;
  EsAgCuInsNom: string;
  EsAgCuInsNomCorto: string;
  TipCurId: number;
  HoraCoche: string;
  AluNro: number;
  InsEst: string;
  TipCurEst: string;
  EscCurEst: string;
  EsAgCuEst: string;
  EsAgCuAviso: number;
  MovilEstado: string;
  Situacion: string;
  HorasNoDisponibles: string;
  claseCelda: string;
}

export interface Cell {
  value: string;
  class: string;
  existe: boolean;
}
