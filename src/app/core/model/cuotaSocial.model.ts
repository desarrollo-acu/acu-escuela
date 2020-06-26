
export interface CuotaSocial {
    cantidad: number;
    SocId: number;
    SocNomCompleto?: string;
    FacturasPendientes: FacturaData[];
    ResponseMercadoPago: any;
    token: string;
    installments: number;
    transaction_amount: number;
    payment_method_id: string;
    issuer_id: string;
}

export interface FacturaData {
    Correlativo: number;
    Seleccionado: boolean;
    MesNom: string;
    Anio: number;
    CCMovImp: string;
    Mes: number;
    pendiente: string;
    EsCuotaActual: string;
    Situacion: string;
    EsCuoEsp: string;
    PromEspId: number;
    OrigenLinea: string;
    FDDocCod: string;
    FDDocSerie: string;
    FDDocNroCh: string;
    FDDocFechCh: Date;
}