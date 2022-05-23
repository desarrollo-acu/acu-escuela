export interface AlumnoSuspension {
  aluId: number;
  fecha: Date;
  motivo: string;
  tipCurId?: number;
  cantidadClasesASuspender?: number;
  usrId?: string;
  escAluCurId: number;
}
