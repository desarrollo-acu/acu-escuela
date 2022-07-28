export interface AlumnoSuspension {
  aluId: number;
  fecha: Date;
  fechaDesde: Date;
  fechaHasta: Date;
  motivo: string;
  usrId: string;
  tipCurId?: number;
  cantidadClasesASuspender?: number;
  escAluCurId?: number;
}
