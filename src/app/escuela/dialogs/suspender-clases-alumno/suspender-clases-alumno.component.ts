import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlumnoService } from '@core/services/alumno.service';
import { GestionAlumnoComponent } from '@escuela/components/gestion-alumno/gestion-alumno.component';
import { confirmacionUsuario } from '@utils/sweet-alert';
import { Alumno } from '../../../core/model/obtener-alumnos.interface';
import { getTomorrow } from '../../../utils/utils-functions';
import { AutenticacionService } from '@core/services/autenticacion.service';
import { mensajeConfirmacion, errorMensaje } from '../../../utils/sweet-alert';
import { MyValidators } from '../../../utils/validators';

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
  get fechaDesde() {
    return this.form.get('fechaDesde');
  }
  get fechaHasta() {
    return this.form.get('fechaHasta');
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
    private autenticacionService: AutenticacionService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GestionAlumnoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.alumno = data.alumno;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      fecha: [getTomorrow()],
      fechaDesde: [null, [Validators.required, MyValidators.fechaAnteriorOIgualAHoy]],
      fechaHasta: [null, [Validators.required, MyValidators.fechaAnteriorOIgualAHoy]],
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
      `¿Confirma la suspensión de las clases futuras del alumno ${this.alumnoNombre.value}?`
    );
    if (isConfirmed) {
      const { AluId: aluId } = this.alumno;
      const { fecha, motivo, fechaDesde, fechaHasta } = this.form.getRawValue();

      this.alumnoService
        .crearClasesAlumnoSuspension({
          aluId,
          fecha,
          fechaDesde,
          fechaHasta,
          motivo,
          usrId: this.autenticacionService.getUserId(),
        })
        .subscribe(({ errorCode, errorMessage }) =>
          errorCode === 0
            ? mensajeConfirmacion('Excelente', errorMessage).then(() =>
                this.dialogRef.close(true)
              )
            : errorMensaje('Error', errorMessage).then(() =>
                this.dialogRef.close()
              )
        );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
