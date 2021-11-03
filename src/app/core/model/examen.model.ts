export class Examen{
  constructor(
    public ALUID?: number,
    public TIPCURID?: number,
    public EscAluCurId?: number,
    public EscAluCurExamenId?: number,
    public EscAluCurExamenFecha?: Date,
    public EscAluCurExamenAprueba?: boolean | number,
    public EscAluCurExamenObservaciones?: string,
    public EscAluCurExamenMotivoReprobacion?: string,
    public EscAluCurExamenSuspendido?: boolean,
    public Alumno?: string,
    public Curso?: string,
    public Fecha?: Date,
    public Observaciones?: string,
    public Mode?: string,
  ){}
}
