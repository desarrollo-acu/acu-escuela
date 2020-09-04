export interface Inscripcion {
  AluId?: number;
  TipCurId?: number;
  EscAluCurId?: number;
  EscCurIni?: Date;
  EscCurFchIns?: Date;
  AluNro?: number;
  AluNom?: string;
  AluNomComp?: string;
  EscCurClaCntAdi?: number;
  EscCurClCobAdi?: number;
  AluCI?: number;
  AluDV?: number;
  AluApe?: string;
  ALUTEL1?: string;
  ALUTEL2?: string;
  TipCurNom?: string;
  TipCurClaPra?: number;
  TipCurClaTeo?: number;
  TipCurExaPra?: string;
  TipCurExaTeo?: string;
  ESCCURTE1?: Date;
  ESCCURTE2?: Date;
  ESCCURTE3?: Date;
  ESCCUREST?: string;
  ESCCUREMP?: string;
  ESCCURRUT?: number;
  ESCCURDET?: string;
  AluCurCanCla?: number;
  EscInsId?: string;
  EscInsNom?: string;
  EscMovCod?: number;
  EscCurClaSusCnt?: number;
  EscCurClSinCosSusCnt?: number;
  EscAluCurObs?: string;
  EscAluCurFiltro?: string;

  EscAluFechaInicioEstimada?: Date;

  EscAluCurSede?: string;
  EscAluCurRecogerEnDomicilio?: boolean;
  EscAluCurCondicionesCurso?: boolean;
  EscAluCurReglamentoEscuela?: boolean;
  EscAluCurELearning?: boolean;

  Lineas1?: InscripcionLinea1[];
  DisponibilidadAlumno?: InscripcionDisponibilidadAlumno[];
  UsrId?: string;
  cantidadExamenes?: number;
}

export interface InscripcionLinea1 {
  AluAgeDia?: string;
  AluAgeMaDe?: Date;
  AluAgeMaA?: Date;
  AluAgeM1De?: Date;
  AluAgeM1A?: Date;
  AluAgeTarDe?: Date;
  AluAgeTarA?: Date;
  AluAgeT1De?: Date;
  AluAgeT1A?: Date;
  AluAgeTieneHoras?: boolean;
}

export interface InscripcionDisponibilidadAlumno {
  AluAgeDia?: string;
  AluAgeHoraInicio?: number;
  AluAgeHoraFin?: number;
}
