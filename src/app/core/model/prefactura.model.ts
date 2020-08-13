export interface Prefactura {
    UsrId?: string;
    FacRuc?: number;
    AluId?: number;
    EscCurEmp?: string;
    FacDto?: number;
    Lineas?: PrefacturaLinea[];

}

export interface PrefacturaLinea {
    ItemCod?: number;
}
