export interface AlumnoByCI {
  cantidad: string;
  alumnos:  Alumno[];
  existe:   boolean;
}

export interface Alumno {
  AluId:            string;
  AluNro:           string;
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
  SocId:            string;
  AluConTel:        string;
  AluConNom:        string;
  AluConPar:        string;
  AluDepId:         number;
  AluLocId:         number;
  AluEstMotBaj:     string;
  AluEst:           string;
  Disponibilidades: any[];
}
