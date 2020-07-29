

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
