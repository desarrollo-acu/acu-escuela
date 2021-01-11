import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AcuService } from '@core/services/acu.service';
import { AlumnoService } from '@core/services/alumno.service';
import { CursoService } from '@core/services/curso.service';
import { SeleccionarAlumnoComponent } from '../seleccionar-alumno/seleccionar-alumno.component';
import { confirmacionUsuario, mensajeConfirmacion, errorMensaje } from '../../../../utils/sweet-alert';

@Component({
  selector: 'app-enviar-notificacion',
  templateUrl: './enviar-notificacion.component.html',
  styleUrls: ['./enviar-notificacion.component.scss'],
})
export class EnviarNotificacionComponent implements OnInit {
  tipoNotificaciones: any[] = [
    { tipo: 1, descripcion: 'Mail' },
    { tipo: 2, descripcion: 'Mensaje de Texto' },
  ];
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    private alumnoService: AlumnoService,
    private acuService: AcuService,
    private cursoService: CursoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.buildForm();
  }

  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }
  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }
  get alumnoCelular() {
    return this.form.get('alumnoCelular');
  }
  get alumnoEmail() {
    return this.form.get('alumnoEmail');
  }
  get tipoNotificacion() {
    return this.form.get('tipoNotificacion');
  }
  get mensaje() {
    return this.form.get('mensaje');
  }
  get asunto() {
    return this.form.get('asunto');
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.formBuilder.group({
      alumnoNumero: [''],
      alumnoNombre: [''],
      alumnoCelular: [''],
      alumnoEmail: ['', Validators.email],
      tipoNotificacion: [''],

      mensaje: ['', Validators.required],
      asunto: ['', Validators.required],
    });

    this.alumnoNombre.disable();
  }

  seleccionarAlumno() {
    this.alumnoService.obtenerAlumnos(5, 1, '').subscribe((res: any) => {
      console.log('res: ', res);
      console.log('res.Cantidad: ', res.Cantidad);
      console.log('res.Alumnos: ', res.Alumnos);

      this.openDialogAlumnos(res.Alumnos, res.Cantidad);
    });
  }

  private openDialogAlumnos(alumnos, cantidad) {
    const alumnosDialogRef = this.dialog.open(SeleccionarAlumnoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        alumnos,
        cantidad,
      },
    });

    alumnosDialogRef.afterClosed().subscribe((alumno) => {
      console.log(alumno);

      if (alumno) {
        this.form.patchValue({
          alumnoNumero: alumno.AluNro,
          alumnoNombre: alumno.AluNomComp,
          alumnoCelular: alumno.AluTel2,
          alumnoEmail: alumno.AluMail,
        });
      }
    });
  }

  enviarNotificacion(event: Event) {
    console.log(event);

    if(this.tipoNotificacion.value.length <= 0){
      errorMensaje('Error', 'Debe seleccionar al menos un tipo de notificación.').then();
      return;
    }

    if (this.form.invalid ) {
      return;
    }

    confirmacionUsuario(
      'Confirmación de usuario',
      'Se enviará una notificación al alumno seleccionado, ¿Desea continuar? '
    ).then((res) => {
      if (!res.isConfirmed) {
        return;
      }

      console.log(this.form.value);
      this.acuService.enviarNotificacion(this.form.value).subscribe( res =>
        mensajeConfirmacion('Excelente!', `Se notificó al alumno ${ this.alumnoNombre.value}, exitosamente!`).then( () => this.dialogRef.close())
      );

    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
