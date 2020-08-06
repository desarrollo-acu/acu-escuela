import { EscuelaEstado } from './escuela-estado.model';

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
    EscMovCod?: number;
    Items?: InstructorItem[];
    Horario?: InstructorHorario[];
}

export interface InstructorItem {
    InsLicIni?: any; // Date | string;
    InsLicFin?: Date | string;
    EscuelaEstado?: EscuelaEstado;
    EscEstId?: number;
    EscEstDsc?: string;
    InsLicObs?: string;

    modo?: string | boolean;
    isInsert?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
}


export interface InstructorHorario {
    EscInsDia: string;
    EscInsM1De: number;
    EscInsM1Ha: number;
    EscInsT1De: number;
    EscInsT1Ha: number;
    EscInsMovMa: number;
    EscInsMovTa: number;

    modo?: string | boolean;
    isInsert?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
}
