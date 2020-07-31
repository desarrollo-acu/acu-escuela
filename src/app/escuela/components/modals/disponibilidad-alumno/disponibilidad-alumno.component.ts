import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InscripcionesAlumnoComponent } from '../inscripciones-alumno/inscripciones-alumno.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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


    this.generateHorasLibres();
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

  generateHorasLibres() {
    for (let i = 6; i < 21; i++) {
      const horaIni = i;
      const horaFin = i + 1;
      const o = {
        value: `${horaIni * 100}-${horaFin * 100}`,
        description: `${horaIni}:00 - ${horaFin}:00`,
        horaIni: `${horaIni * 100}`,
        horaFin: `${horaFin * 100}`,
      };
      this.horasLibres.push(o);
    }

    console.log('horas libres: ', this.horasLibres);
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
