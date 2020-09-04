export interface AutenticacionResponse {
    UsrId?: string;
    UsrNom?: string;
    UsrPerf?: string;
    UsrPerfId?: string;
    SctId?: string;
    SctNom?: string;
    UsrDirMail?: string;
    UsrPrgMail?: string;
    SecId?: string;
    UsrAct?: string;
    UsrPdrItmCod?: number;
    UsrFunId?: number;

    estaLogueado?: boolean;
    LoginEscuela?: Login;
}

export interface Login {

    LoginOk: boolean;
    Mensaje: string;

}

