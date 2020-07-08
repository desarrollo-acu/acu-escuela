export interface Curso {
    TipCurId?: number;
    TipCurNom?: string;
    TipCurClaPra?: number;
    TipCurClaTeo?: number;
    TipCurEst?: string;
    TipCurExaPra?: string;
    TipCurExaTeo?: string;
    TipCurSoc?: string;
    TipCuItemIdValCur?: number;
    TipCuItemDescValCur?: string;
    Items?: CursoItem[];

}

export interface CursoItem {
    EscItemCod?: number;
    EscItemDesc?: string;
    EscCurItemCur?: string;
    EscCurIteClaAdi?: string;
}

