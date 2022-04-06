import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeleccionarRow } from '@core/model/seleccionar-row.interface';
import { InscripcionService } from '@core/services/inscripcion.service';
import { Inscripcion } from '../../../core/model/inscripcion.model';

@Component({
  selector: 'app-seleccionar-inscripcion',
  templateUrl: './seleccionar-inscripcion.component.html',
  styleUrls: ['./seleccionar-inscripcion.component.scss']
})
export class SeleccionarInscripcionComponent   {
  inscripciones: Inscripcion[];
  columnas = ['actions', 'Curso', 'Fecha'];

  constructor(
    private inscripcionService: InscripcionService,
    public dialogRef: MatDialogRef<any>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.inscripciones = data.inscripciones;
    }


    onSeleccionar(data: SeleccionarRow) {
      if (data.selected) {
        this.dialogRef.close(data.extraData);

      } else {
        this.dialogRef.close();
      }
    }

    getInscripciones(alumnoId: number) {
      this.inscripcionService.getInscripcionesByAlumno(alumnoId).subscribe((sdt: any) => this.inscripciones = sdt.inscripciones);
    }

}
