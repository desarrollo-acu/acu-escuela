export interface AlumnoSuspension {
  aluId: number;
  fecha: Date;
  motivo: string;
  usrId: string;
  tipCurId?: number;
  cantidadClasesASuspender?: number;
  escAluCurId?: number;
}
