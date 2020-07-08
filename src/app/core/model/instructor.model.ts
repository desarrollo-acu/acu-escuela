export interface Instructor {
    EscInsId?: string;
    EscInsNom?: string;
    EscInsNomCor?: string;
    EscInsTel?: string;
    EscInsDir?: string;
    EscInsAct?: string;
    EscInsSocMed?: string;
    EscInsConNom?: string;
    EscInsConTel?: string;
    Items?: InstructorItem[];
}

export interface InstructorItem {
    InsLicIni?: Date;
    InsLicFin?: Date;
    EscEstId?: number;
    EscEstDsc?: string;
    InsLicObs?: string;
}

