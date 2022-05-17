import { InscripcionesAlumnoComponent } from './../inscripciones-alumno/inscripciones-alumno.component';
import { AlumnoService } from '@core/services/alumno.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { InscripcionService } from '@core/services/inscripcion.service';
import * as moment from 'moment';
import { isMoment, Moment } from 'moment';
import { MyValidators } from 'src/app/utils/validators';
import { mensajeConfirmacion } from '@utils/sweet-alert';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-examen-medico',
  templateUrl: './examen-medico.component.html',
  styleUrls: ['./examen-medico.component.scss'],
})
export class ExamenMedicoComponent implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<ExamenMedicoComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    private inscripcionService: AlumnoService
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      examenMedico: [false, MyValidators.EsChecked],
      fechaLicCedulaIdentidad: [''],
      fechaPagoLicencia: [''],
      fechaExamenMedico: ['', MyValidators.EsMayorA30Dias],
      fechaExamenMedicoActual: [''],
    });
  }

  changeExamenMedico(event: MatCheckboxChange) {
    if (event.checked) {
      return this.fechaExamenMedicoField.setValue(new Date());
    }

    return this.fechaExamenMedicoField.setValue('');
  }

  ingresarExamenMedico(event) {
    let inscripcion = JSON.parse(localStorage.getItem('inscripcionDatos'));

    if (inscripcion) {
      var fecha = new Date(this.fechaExamenString);
      const strFecha = this.formatDateToString(fecha);
      this.inscripcionService
        .ingresarExamenMedico(
          inscripcion.AluId,
          inscripcion.TipCurId,
          inscripcion.EscAluCurId,
          strFecha
        )
        .subscribe((res: any) => {
          mensajeConfirmacion('Confirmado!', res.errorMessage).then((res2) => {
            this.dialogRef.close();
            this.router.navigate(['/escuela/gestion-alumno']);
          });
        });
    }
  }

  formatDateToString(fechaParm: Date | Moment): string {
    let auxFecha: Date;
    if (isMoment(fechaParm)) {
      auxFecha = fechaParm.toDate();
    } else if (fechaParm instanceof Date) {
      auxFecha = fechaParm;
    }
    const fecha = auxFecha;
    const day = fecha.getDate();
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    let strDay;
    let strMonth;
    const strYear = year.toString();

    if (day < 10) {
      strDay = '0' + day.toString();
    } else {
      strDay = day.toString();
    }

    if (month < 10) {
      strMonth = '0' + month.toString();
    } else {
      strMonth = month.toString();
    }
    return `${strYear}-${strMonth}-${strDay}`;
  }

  get fechaExamenMedicoField() {
    return this.form.get('fechaExamenMedico');
  }
  get examenMedicoField() {
    return this.form.get('examenMedico');
  }
  get fechaExamenMedicoActualField() {
    return this.form.get('fechaExamenMedicoActual');
  }

  get fechaExamenString() {
    return this.form.get('fechaExamenMedico').value;
  }
  ngOnInit(): void {
    let inscripcion = JSON.parse(localStorage.getItem('inscripcionDatos'));

    if (inscripcion) {
      //
      this.inscripcionService
        .getExamenMedico(
          inscripcion.AluId,
          inscripcion.TipCurId,
          inscripcion.EscAluCurId
        )
        .subscribe((res: any) => {
          var date = moment(res.EscAluCurFechaExamenMedico);
          if (date.isValid()) {
            this.fechaExamenMedicoActualField.setValue(
              moment(date).format('DD/MM/yyyy')
            );
          } else {
            this.fechaExamenMedicoActualField.setValue(
              'No tiene fecha de examen médico ingresada previamente.'
            );
          }
        });
    }
    this.fechaExamenMedicoActualField.disable();
  }
  ngOnDestroy(): void {}
  get fechaExamenMedico() {
    return this.form.get('fechaExamenMedico');
  }

  fechaExamenChecked() {
    var value = this.fechaExamenMedicoField.value;
    if (value) return value;
  }
}
