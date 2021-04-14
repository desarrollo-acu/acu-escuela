import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InscripcionesAlumnoComponent } from '../inscripciones-alumno/inscripciones-alumno.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { generateHorasLibres } from '../../../../utils/utils-functions';

@Component({
  selector: 'app-disponibilidad-alumno',
  templateUrl: './disponibilidad-alumno.component.html',
  styleUrls: ['./disponibilidad-alumno.component.scss']
})
export class DisponibilidadAlumnoComponent implements OnInit {

  form: FormGroup;
  horasLibres = [];
  titulo: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InscripcionesAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log('data: ', data);
    this.titulo = `${this.data.inscripcion.AluNro} - ${this.data.inscripcion.AluNomApe}`;


    this.horasLibres = generateHorasLibres();
    this.buildForm();
  }


  ngOnInit(): void {
  }


  buildForm() {

    this.form = this.formBuilder.group({
      disponibilidadLunes: [this.data.inscripcion.disponibilidadLunes],
      disponibilidadMartes: [this.data.inscripcion.disponibilidadMartes],
      disponibilidadMiercoles: [this.data.inscripcion.disponibilidadMiercoles],
      disponibilidadJueves: [this.data.inscripcion.disponibilidadJueves],
      disponibilidadViernes: [this.data.inscripcion.disponibilidadViernes],
      disponibilidadSabado: [this.data.inscripcion.disponibilidadSabado],

    });
  }


  onNoClick() {
    this.dialogRef.close();
  }

}
