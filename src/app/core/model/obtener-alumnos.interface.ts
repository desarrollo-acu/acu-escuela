export interface ObtenerAlumnos {
  cantidad: string;
  alumnos:  Alumno[];
  existe:   boolean;
}

export interface Alumno {
  AluId:            number;
  AluNro:           number;
  AluNom:           string;
  AluApe1:          string;
  AluNomComp:       string;
  AluFchNac:        Date;
  AluCI:            string;
  AluDV:            number;
  AluDir:           string;
  AluTel1:          string;
  AluTel2:          string;
  AluMail:          string;
  AluPar:           string;
  SocId:            number;
  AluConTel:        string;
  AluConNom:        string;
  AluConPar:        string;
  AluDepId:         number;
  AluLocId:         number;
  AluEstMotBaj:     string;
  AluEst:           string;
  Disponibilidades: any[];
}
