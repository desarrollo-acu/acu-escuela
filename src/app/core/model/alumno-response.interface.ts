import { Alumno } from "./alumno.model";

export interface AlumnoResponse {
  cantidad: number;
  alumnos: Alumno[],
  existe: boolean,
}
