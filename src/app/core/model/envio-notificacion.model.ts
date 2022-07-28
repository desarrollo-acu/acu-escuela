export interface EnvioNotificacion {
  alumnoCelular?: string;
  alumnoEmail?: string;
  alumnoNumero?: number;
  alumnoId?: number;
  mensaje?: string;
  asunto?: string;
  tipoNotificacion?: TipoNotificacion[];
  usrId?: string;
  tipo?: number;
  fecha?: Date | string;
  esAgInsFch?: Date;
  agInsHorIni?: number;
  escInsId?: number;
  escAluCurId?: number;
  tipCurId?: number;
  periodicidad?: string;
  tipoDescripcion?: string;
}

export interface TipoNotificacion {
  tipo: number;
  descripcion: string;
}
