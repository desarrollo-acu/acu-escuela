export interface ResultadoExamenPractico {
  id:                     number;
  escInsId:               string;
  alumnoNombreApellido:   string;
  esAlumnoOtroInstructor: boolean;
  instructorAlumnoId:     string;
  resultado:              number;
  motivoReprobacionPista: null;
  motivoReprobacionCalle: null;
  detalleMotivoPerdida:   null;
  fechaCreacion:          Date;
}
