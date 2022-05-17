export interface ClaseEstimada {
  AluId?: number;
  EscInsId?: string;
  EscInsNom?: string;
  FechaInicio?: Date;
  FechaFin?: Date;
  Fecha?: Date;
  Detalle?: ClaseEstimadaDetalle[];
}

export interface ClaseEstimadaDetalle {
  Fecha?: string;
  HoraInicio?: number;
  HoraFin?: number;
}

//Al suspender una clase sin sin cobrar, necesito un campo extra que me indiqué si el alumno ya tiene clases para el día que se estima
export interface ClaseEstimadaDetalleParaSuspension {
  Fecha?: string;
  HoraInicio?: number;
  HoraFin?: number;
  diaYaAsignado?: boolean;
}
