export interface EnvioNotificacion {
  alumnoCelular?: string;
  alumnoEmail?: string;
  alumnoNumero?: number;
  alumnoId?: number;
  mensaje?: string;
  asunto?: string;
  tipoNotificacion?: TipoNotificacion[];
}

export interface TipoNotificacion {
  tipo: number;
  descripcion: string;
}
