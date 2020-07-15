import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { AgendaMovilComponent } from '../../agenda-movil/agenda-movil.component';
import { AcuService } from 'src/app/core/services/acu.service';


@Component({
  selector: 'app-suspender-clase',
  templateUrl: './suspender-clase.component.html',
  styleUrls: ['./suspender-clase.component.scss']
})
export class SuspenderClaseComponent implements OnInit {

  form: FormGroup;
  horasLibres = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,
    private acuService: AcuService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    console.log('data: ', this.data);
    this.generateHorasLibres();
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {

    this.form = this.formBuilder.group({
      // fechaClase: [this.fechaClase, [MyValidators.fechaPosteriorAHoy]],
      // cursoId: [
      //   '',
      //   [Validators.required], // sync validators
      //   [
      //     // existeAlumnoValidator(this.acuService),
      //     // alumnoYaAsignadoValidator(this.acuService),
      //     // alumnoTieneExcepcionValidator(this.acuService)
      //   ] // async validators
      // ],
      // cursoNombre: [''],
      // cursoClasesPracticas: [''],
      // cursoClasesTeoricas: [''],
      // cursoExamenPractico: [''],
      // cursoExamenTeorico: [''],
      // fechaInicioEstimada: ['', Validators.required],
      // escCurTe1: ['', Validators.required],
      // escCurTe2: ['', Validators.required],
      // escCurTe3: ['', Validators.required],
      // escCurIni: ['', [Validators.required, MyValidators.fechaAnteriorAHoy]],
      // alumnoNumero: [
      //   '',
      //   [Validators.required], // sync validators
      //   // [
      //   //   existeAlumnoValidator(this.acuService),
      //   //   alumnoYaAsignadoValidator(this.acuService),
      //   //   alumnoTieneExcepcionValidator(this.acuService)
      //   // ] // async validators
      // ],
      // alumnoNombre: [''],
      // alumnoCI: [''],
      // alumnoTelefono: [''],
      // alumnoCelular: [''],
      // sede: [''],
      // irABuscarAlAlumno: [false],
      disponibilidadLunes: [this.data.agendaClase.disponibilidadLunes],
      disponibilidadMartes: [this.data.agendaClase.disponibilidadMartes],
      disponibilidadMiercoles: [this.data.agendaClase.disponibilidadMiercoles],
      disponibilidadJueves: [this.data.agendaClase.disponibilidadJueves],
      disponibilidadViernes: [this.data.agendaClase.disponibilidadViernes],
      disponibilidadSabado: [this.data.agendaClase.disponibilidadSabado],
      observaciones: ['']
    },
      //  {
      //   validator: [
      //     ValidateFechaPosterior('escCurIni', 'escCurTe1'),
      //     ValidateFechaPosterior('escCurTe1', 'escCurTe2'),
      //     ValidateFechaPosterior('escCurTe2', 'escCurTe3')]
      // }
    );

  }
  suspenderClase(event: Event) {
    event.preventDefault();

    console.log('form.value: ', this.form.value);
    console.log('disponibilidadLunes.value: ', this.disponibilidadLunes.value);


  }

  onNoClick(): void {
    this.dialogRef.close();
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


  get disponibilidadLunes() {
    return this.form.get('disponibilidadLunes');
  }

  get disponibilidadMartes() {
    return this.form.get('disponibilidadMartes');
  }

  get disponibilidadMiercoles() {
    return this.form.get('disponibilidadMiercoles');
  }

  get disponibilidadJueves() {
    return this.form.get('disponibilidadJueves');
  }

  get disponibilidadViernes() {
    return this.form.get('disponibilidadViernes');
  }

  get disponibilidadSabado() {
    return this.form.get('disponibilidadSabado');
  }
}
