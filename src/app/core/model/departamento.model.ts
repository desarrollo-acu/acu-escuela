import { Localidad } from './localidad.model';

export interface Departamento {
    DepId: number;
    DepNom: string;
    Localidades: Localidad[];


}