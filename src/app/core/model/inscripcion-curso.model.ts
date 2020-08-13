export interface InscripcionCurso {
    TrnMode?: string;
    FechaClase?: string;
    Hora?: number;
    EscInsId?: string;
    EscInsNom?: string;
    TipCurId?: number;
    TipCurNom?: string;
    EscAgeInsObservaciones?: string;
    mensaje?: string;
    AluId?: number;
    AluNro?: number;
    AluNomApe?: string;
    AluCI?: number;
    AluTel1?: number;
    AluTel2?: number;
    disponibilidadLunes?: string[];
    disponibilidadMartes?: string[];
    disponibilidadMiercoles?: string[];
    disponibilidadJueves?: string[];
    disponibilidadViernes?: string[];
    disponibilidadSabado?: string[];
    fechaClaseEstimada?: Date;
    escCurTe1?: Date;
    escCurTe2?: Date;
    escCurTe3?: Date;
    FacturaRut?: {
        generaFactura?: boolean;
        motivoNoFactura?: string;
        facturaConRUT?: boolean;
        RUT?: string;
        razonSocial?: string;
        descuento?: number;
    };
    SeleccionarItemsFactura?: {
        TipCurId: number;
        EscItemCod: number;
        EscItemDesc: string;
        EscCurIteClaAdi: string;
    };
    facturaEstadoPendiente?: boolean;
    ClasesEstimadas?: any; // Luego se debe agregar la estructura

    sede?: string;
    irABuscarAlAlumno?: boolean;
    escCurIni?: Date;
    escCurFchIns?: Date;

    documentosEntregadosYFirmados?: boolean;
    reglamentoEscuela?: boolean;
    condicionesCurso?: boolean;
    eLearning?: boolean;
    UsrId?: string;


}
