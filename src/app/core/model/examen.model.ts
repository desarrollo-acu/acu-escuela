export class Examen{
  constructor(
    public ALUID?: string,
    public TIPCURID?: string,
    public EscAluCurId?: string,
    public EscAluCurExamenId?: string,
    public EscAluCurExamenFecha?: string,
    public EscAluCurExamenAprueba?: string,
    public EscAluCurExamenObservaciones?: string,
    public EscAluCurExamenMotivoReprobacion?: string,
    public Alumno?: string,
    public Curso?: string,
    public Fecha?: string,
    public Observaciones?: string,
  ){}
}
