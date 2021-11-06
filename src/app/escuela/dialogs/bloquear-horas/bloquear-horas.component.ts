import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Instructor } from '@core/model/instructor.model';
import { InstructorService } from '@core/services/instructor.service';
import { GestionInscripcionComponent } from '@escuela/components/gestion-inscripcion/gestion-inscripcion.component';
import { SeleccionarInstructorComponent } from '@escuela/components/modals/seleccionar-instructor/seleccionar-instructor.component';
import { confirmacionUsuario } from '@utils/sweet-alert';
import { generateHorasLibres } from '@utils/utils-functions';
import { MyValidators } from '@utils/validators';
import { AutenticacionService } from '../../../core/services/autenticacion.service';
import {
  mensajeConfirmacion,
  mensajeWarning,
} from '../../../utils/sweet-alert';

@Component({
  selector: 'app-bloquear-horas',
  templateUrl: './bloquear-horas.component.html',
  styleUrls: ['./bloquear-horas.component.scss'],
})
export class BloquearHorasComponent implements OnInit {
  form: FormGroup;
  horasLibres = [];

  get tipo() {
    return this.form.get('tipo');
  }

  get fecha() {
    return this.form.get('fecha');
  }

  get escInsId() {
    return this.form.get('escInsId');
  }

  get escInsNom() {
    return this.form.get('escInsNom');
  }

  get bloquearATodos() {
    return this.form.get('bloquearATodos');
  }

  get observaciones() {
    return this.form.get('observaciones');
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GestionInscripcionComponent>,
    public dialog: MatDialog,
    private instructorService: InstructorService,
    private authService: AutenticacionService
  ) {
    this.horasLibres = generateHorasLibres();
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.formBuilder.group({
      tipo: ['bloquear'],
      fecha: [null, Validators.required],
      horas: [null, Validators.required],
      bloquearATodos: [false],
      escInsId: [null],
      escInsNom: [null],
      observaciones: [null, Validators.required],
    });

    this.escInsNom.disable();
  }

  seleccionarInstructor() {
    this.instructorService
      .getInstructoresActivos()
      .subscribe((instructores: Instructor[]) => {
        this.openDialogInstructores(instructores);
      });
  }

  private openDialogInstructores(instructores) {
    const instructoresDialogRef = this.dialog.open(
      SeleccionarInstructorComponent,
      {
        height: 'auto',
        width: '700px',
        data: {
          instructores,
        },
      }
    );

    instructoresDialogRef.afterClosed().subscribe((result) => {
      this.form.patchValue({
        escInsId: result.EscInsId,
        escInsNom: result.EscInsNom,
      });
    });
  }

  bloquearHoras(event: Event) {
    event.preventDefault();

    if (this.isFormInvalid()) {
      return;
    }

    confirmacionUsuario(
      'Confirmación de Usuario',
      '¿Confirma bloquear las horas seleccionadas?'
    ).then(({ isConfirmed }) => {
      if (isConfirmed) {
        const isBloquear = this.tipo.value === 'bloquear';
        this.instructorService
          .bloquearHoras({
            ...this.form.value,
            usrId: this.authService.getUserId(),
            isBloquear,
          })
          .subscribe(({ mensajes }) => {
            if (mensajes.length > 0) {
              const mensajesPlain = mensajes.reduce(
                (mensajeFinal, m) => `${mensajeFinal}<br/>${m}<br/>`
              );
              mensajeWarning(
                'Ok',
                null,
                10000,
                `Se ${
                  isBloquear ? 'bloquearon' : 'desbloquearon'
                } las horas seleccionadas ha excepción de: <br/>${mensajesPlain}`
              ).then(() => this.dialogRef.close());
            } else {
              mensajeConfirmacion(
                'Excelente!',
                `Se ${
                  isBloquear ? 'bloquearon' : 'desbloquearon'
                } las horas seleccionadas, exitosamente!`
              ).then(() => this.dialogRef.close());
            }
          });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isFormInvalid = () =>
    this.form.invalid ||
    (!this.bloquearATodos.value &&
      (this.escInsId.value === null || this.escInsId.value === ''));
}
