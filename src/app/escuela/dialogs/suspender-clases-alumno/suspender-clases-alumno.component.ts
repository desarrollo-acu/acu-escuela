import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlumnoService } from '@core/services/alumno.service';
import { GestionAlumnoComponent } from '@escuela/components/gestion-alumno/gestion-alumno.component';
import { confirmacionUsuario } from '@utils/sweet-alert';
import { Alumno } from '../../../core/model/obtener-alumnos.interface';
import { getTomorrow } from '../../../utils/utils-functions';

@Component({
  selector: 'app-suspender-clases-alumno',
  templateUrl: './suspender-clases-alumno.component.html',
  styleUrls: ['./suspender-clases-alumno.component.scss'],
})
export class SuspenderClasesAlumnoComponent implements OnInit {
  form: FormGroup;
  alumno: Alumno;

  get fecha() {
    return this.form.get('fecha');
  }
  get motivo() {
    return this.form.get('motivo');
  }
  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }
  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }
  constructor(
    private alumnoService: AlumnoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GestionAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.alumno = data.alumno;
    console.log(data.alumno);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fecha: [getTomorrow()],
      alumnoNumero: [this.alumno.AluNro, Validators.required],
      alumnoNombre: [this.alumno.AluNomComp],
      motivo: ['', Validators.required],
    });

    this.fecha.disable();
    this.alumnoNumero.disable();
    this.alumnoNombre.disable();
  }

  async suspenderClases(event: Event) {
    event.preventDefault();
    if (this.form.invalid) {
      return;
    }

    const { isConfirmed } = await confirmacionUsuario(
      'Confirmación de Usuario',
      '¿Confirma la generación del nuevo plan de clases ?'
    );
    if (isConfirmed) {
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
