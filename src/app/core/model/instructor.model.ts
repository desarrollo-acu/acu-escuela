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
    Items?: InstructorItem[];
}

export interface InstructorItem {
    InsLicIni?: Date;
    InsLicFin?: Date;
    EscuelaEstado?: EscuelaEstado;
    EscEstId?: number;
    EscEstDsc?: string;
    InsLicObs?: string;

    modo?: string | boolean;
    isInsert?: boolean;
    isUpdate?: boolean;
    isDelete?: boolean;
}

