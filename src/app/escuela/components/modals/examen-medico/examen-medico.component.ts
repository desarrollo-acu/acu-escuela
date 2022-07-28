import { Inscripcion } from '@core/model/inscripcion.model';
import { AlumnoService } from '@core/services/alumno.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import * as moment from 'moment';
import { MyValidators } from 'src/app/utils/validators';
import { mensajeConfirmacion } from '@utils/sweet-alert';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDateToString } from '@utils/utils-functions';
@Component({
  selector: 'app-examen-medico',
  templateUrl: './examen-medico.component.html',
  styleUrls: ['./examen-medico.component.scss'],
})
export class ExamenMedicoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  inscripcion: Inscripcion;
  tieneFechaValida: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { inscripcion: Inscripcion; tieneFechaValida: boolean },
    public dialogRef: MatDialogRef<ExamenMedicoComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    private inscripcionService: AlumnoService
  ) {
    this.inscripcion = data.inscripcion;
    this.tieneFechaValida = data.tieneFechaValida;

    this.buildForm();
  }

  ngOnInit(): void {
    if (this.inscripcion) {
      if (this.tieneFechaValida) {
        this.fechaExamenMedicoActual.setValue(
          moment(this.inscripcion.EscAluCurFechaExamenMedico).format(
            'DD/MM/yyyy'
          )
        );
      } else {
        this.fechaExamenMedicoActual.setValue(
          'No tiene fecha de examen médico ingresada previamente.'
        );
      }
    }
    this.fechaExamenMedicoActual.disable();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      examenMedico: [false, MyValidators.EsChecked],
      fechaLicCedulaIdentidad: [''],
      fechaPagoLicencia: [''],
      fechaExamenMedico: [
        '',
        [MyValidators.EsMayorA30Dias, MyValidators.fechaPosteriorAHoy],
      ],
      fechaExamenMedicoActual: [this.inscripcion.EscAluCurFechaExamenMedico],
    });
  }

  changeExamenMedico(event: MatCheckboxChange) {
    if (event.checked) {
      return this.fechaExamenMedicoField.setValue(new Date());
    }

    return this.fechaExamenMedicoField.setValue('');
  }

  ingresarExamenMedico(event) {
    if (this.inscripcion) {
      const fecha = new Date(this.fechaExamenString);
      const strFecha = formatDateToString(fecha);
      this.inscripcionService
        .ingresarExamenMedico(
          this.inscripcion.AluId,
          this.inscripcion.TipCurId,
          this.inscripcion.EscAluCurId,
          strFecha
        )
        .subscribe((res: any) => {
          mensajeConfirmacion('Confirmado!', res.errorMessage).then((res2) => {
            this.dialogRef.close();
            this.router.navigate(['/escuela/gestion-inscripcion']);
          });
        });
    }
  }

  fechaExamenChecked() {
    return this.fechaExamenMedicoField?.value;
  }

  get fechaExamenMedicoField() {
    return this.form.get('fechaExamenMedico');
  }
  get examenMedicoField() {
    return this.form.get('examenMedico');
  }
  get fechaExamenMedicoActual() {
    return this.form.get('fechaExamenMedicoActual');
  }

  get fechaExamenString() {
    return this.form.get('fechaExamenMedico').value;
  }
  get fechaExamenMedico() {
    return this.form.get('fechaExamenMedico');
  }

  ngOnDestroy(): void {}
}
