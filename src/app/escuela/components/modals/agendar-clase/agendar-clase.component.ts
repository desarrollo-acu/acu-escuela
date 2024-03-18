import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { SeleccionarAlumnoComponent } from '../seleccionar-alumno/seleccionar-alumno.component';
import { SeleccionarInstructorComponent } from '../seleccionar-instructor/seleccionar-instructor.component';

import Swal from 'sweetalert2';
import { existeAlumnoValidator } from '@utils/validators/existe-alumno-validator.directive';
import { alumnoYaAsignadoValidator } from '@utils/validators/alumno-ya-asignado.directive';
import { alumnoTieneExcepcionValidator } from '@utils/validators/alumno-tiene-excepecion.directive';
import { instructorYaAsignadoValidator } from '@utils/validators/instructor-ya-asignado-validator.directive';
import { licenciaInstructorValidator } from '@utils/validators/licencia-instructor-validator.directive';

import { AgendaClase } from '@core/model/agenda-clase.model';
import { AlumnoService } from '@core/services/alumno.service';
import { InstructorService } from '@core/services/instructor.service';
import { CursoService } from '@core/services/curso.service';
import { SeleccionarCursoComponent } from '../seleccionar-curso/seleccionar-curso.component';
import { Alumno } from '@core/model/alumno.model';
import { AcuService } from '@core/services/acu.service';
import { Instructor } from '../../../../core/model/instructor.model';
import { AgendaMovilComponent } from '@escuela/components/agenda-movil/agenda-movil.component';

@Component({
  selector: 'app-agendar-clase',
  templateUrl: './agendar-clase.component.html',
  styleUrls: ['./agendar-clase.component.scss'],
})
export class AgendarClaseComponent implements OnInit {
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  selected = ' ';
  agendaClase: AgendaClase;
  horaString: string;
  horaNumber: number;
  fechaClase: Date = new Date();

  curso: string;
  hoy = new Date();

  // para el dialog
  alumno: Alumno = {};
  esAgCuAviso: number;
  avisar: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,
    private acuService: AcuService,
    private cursoService: CursoService,
    private alumnoService: AlumnoService,
    private instructorService: InstructorService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.agendaClase = this.data.agendaClase;
    const day = Number(
      this.agendaClase.FechaClase.substring(
        this.agendaClase.FechaClase.length - 2,
        this.agendaClase.FechaClase.length
      )
    );
    const month = Number(this.agendaClase.FechaClase.substring(5, 7));
    const year = Number(this.agendaClase.FechaClase.substring(0, 4));

    this.fechaClase.setDate(day);
    this.fechaClase.setMonth(month - 1);
    this.fechaClase.setFullYear(year);

    this.esAgCuAviso = this.agendaClase.EsAgCuAviso;
    this.avisar =
      this.agendaClase.EsAgCuAviso === 0 || this.agendaClase.EsAgCuAviso === 2
        ? 'Avisar'
        : 'Avisado';
    this.alumno.AluId = this.agendaClase.AluId;

    this.horaString = `${this.agendaClase.Hora}:00`;

    this.buildForm();
    this.deshabilitarCampos();
  }
  ngOnInit() {
    // toISOString, es el formato que leyo bien la api.
    localStorage.setItem('fechaClase', this.fechaClase.toISOString());
    const horaStr = this.agendaClase.Hora * 100;
    localStorage.setItem('horaClase', horaStr.toString());
    localStorage.setItem('movilCod', this.movil.toString());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private buildForm() {
    if (this.agendaClase) {
      this.form = this.formBuilder.group({
        fecha: [this.fechaClase],
        hora: [this.horaString],
        movil: [this.agendaClase.EscMovCod],
        alumnoNumero: [
          this.agendaClase.AluNro,
          [Validators.required], // sync validators
          [
            existeAlumnoValidator(this.alumnoService),
            alumnoYaAsignadoValidator(this.alumnoService),
            alumnoTieneExcepcionValidator(this.alumnoService),
          ], // async validators
        ],
        alumnoNombre: [this.agendaClase.AluNomApe],
        cursoId: [this.agendaClase.TipCurId, [Validators.required]],
        cursoNombre: [this.agendaClase.TipCurNom],
        tipoClase: [this.agendaClase.EsAgCuTipCla],
        numeroClase: [this.agendaClase.EsAgCuNroCla],
        claseAdicional: [this.agendaClase.EsAgCuClaAdiSN],
        avisoInstructor: [this.agendaClase.AvisoInstructor],

        instructorId: [
          this.agendaClase.EsAgCuInsId,
          [Validators.required], // sync validators
          [
            licenciaInstructorValidator(this.instructorService),
            instructorYaAsignadoValidator(this.instructorService),
          ], // async validators
        ],
        instructorNombre: [
          `${this.agendaClase.EsAgCuInsId.toString().trim()} ${
            this.agendaClase.EsAgCuInsNom
          }`,
        ],
        detalle: [this.agendaClase.EsAgCuDet],
        estadoClase: [this.agendaClase.EsAgCuEst],
        observaciones: [this.agendaClase.EsAgCuObs],
        aviso: [this.agendaClase.EsAgCuDetAviso],
      });
    } else {
      this.form = this.formBuilder.group({
        fecha: [''],
        hora: [''],
        movil: [''],
        alumnoNumero: [
          '',
          [Validators.required], // sync validators
          [
            existeAlumnoValidator(this.alumnoService),
            alumnoYaAsignadoValidator(this.alumnoService),
            alumnoTieneExcepcionValidator(this.alumnoService),
          ], // async validators
        ],
        alumnoNombre: ['', [Validators.required]],

        cursoId: ['', [Validators.required]],
        cursoNombre: [''],
        tipoClase: [''],
        numeroClase: [''],
        claseAdicional: [''],
        avisoInstructor: [''],
        instructorId: [
          '',
          [Validators.required], // sync validators
          [
            licenciaInstructorValidator(this.instructorService),
            instructorYaAsignadoValidator(this.instructorService),
          ], // async validators
        ],
        instructorNombre: [''],
        detalle: [''],
        estadoClase: [''],
        observaciones: [''],
        aviso: [''],
      });
    }
  }

  deshabilitarCampos() {
    // Deshabilitar fecha de inscripicón
    this.fecha.disable();
    this.hora.disable();
    this.movil.disable();

    // Campos deshabilitados del alumno
    this.alumnoNombre.disable();

    // Campos deshabilitados del curso

    this.cursoNombre.disable();
    this.numeroClase.disable();
    this.claseAdicional.disable();

    // Campos deshabilitados del instructor

    this.instructorNombre.disable();
    this.avisoInstructor.disable();

    this.estadoClase.disable();
  }

  seleccionarInstructor() {
    this.instructorService
      .getInstructores()
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
      this.alumno = result;
      this.form.patchValue({
        instructor: result.EscInsId,
        instructorAsignado: result.EscInsNom,
      });
    });
  }

  seleccionarAlumno() {
    this.alumnoService
      .getAlumnos()
      .subscribe((res: any) => this.openDialogAlumnos(res.Alumnos));
  }

  seleccionarCurso() {
    this.cursoService
      .getCursos()
      .subscribe((res: any) => this.openDialogCursos(res));
  }

  private openDialogCursos(cursos) {
    const cursosDialogRef = this.dialog.open(SeleccionarCursoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        cursos,
      },
    });

    cursosDialogRef.afterClosed().subscribe((result) => {
      this.curso = result;
      this.agendaClase.TipCurId = result.TipCurId;
      this.agendaClase.TipCurNom = result.TipCurNom;
      this.addInfoCursoToForm(result);
    });
  }
  private openDialogAlumnos(alumnos) {
    const alumnosDialogRef = this.dialog.open(SeleccionarAlumnoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        alumnos,
      },
    });

    alumnosDialogRef.afterClosed().subscribe((alumno: Alumno) => {
      this.alumno = alumno;
      this.form.patchValue({
        alumnoNombre: alumno.AluNomComp,
        alumnoNumero: alumno.AluNro,
      });
    });
  }

  avisoAlumno() {
    if (this.esAgCuAviso === 0 || this.esAgCuAviso === 2) {
      this.avisar = 'Avisado';
      this.esAgCuAviso = 1;
    } else {
      this.avisar = 'Avisar';
      this.esAgCuAviso = 2;
    }
  }

  guardarClase(event: Event) {
    event.preventDefault();

    if (this.form.invalid) {
      return;
    }

    const agendaClase: AgendaClase = {
      FechaClase: this.agendaClase.FechaClase,
      Hora: this.agendaClase.Hora,
      EscMovCod: this.agendaClase.EscMovCod,
      Modo: this.agendaClase.Modo,
      EsAgCuInsId: this.instructorId.value,
      AluId: this.alumno.AluId,
      TipCurId: this.cursoId.value,
      EscAluCurId: this.agendaClase.EscAluCurId,
      EsAgCuDet: this.detalle.value,
      EsAgCuTipCla: this.tipoClase.value,
      EsAgCuObs: this.observaciones.value,
      EsAgCuNroCla: this.numeroClase.value,
      EsAgCuEst: this.estadoClase.value,
      EsAgCuClaAdiSN: this.claseAdicional.value,
      EsAgCuDetAviso: this.aviso.value,
      EsAgCuDetAvisoOld: this.agendaClase.EsAgCuDetAvisoOld,

      UsrId: localStorage.getItem('UsrId'),
    };

    this.acuService
      .guardarAgendaClase(this.agendaClase)
      .subscribe((res: any) => this.dialogRef.close(res));
  }

  obtenerCurso() {
    const cursoId = this.form.get('cursoId').value;
    if (cursoId !== '') {
      this.cursoService.getCurso(cursoId).subscribe((res: any) => {
        if (res.TipCurId === '0') {
          Swal.fire({
            icon: 'warning',
            title: 'No encontrado!',
            text: 'El código del curso no existe, seleccione un existente.',
          });
        }

        res.TipCurId = cursoId;
        this.agendaClase.TipCurId = res.TipCurId;
        this.agendaClase.TipCurNom = res.TipCurId;

        this.addInfoCursoToForm(res);
      });
    }
  }

  addInfoCursoToForm(result: any) {
    this.form.patchValue({
      cursoId: result.TipCurId,
      cursoNombre: result.TipCurNom,
    });
  }

  get fecha() {
    return this.form.get('fecha');
  }

  get hora() {
    return this.form.get('hora');
  }

  get movil() {
    return this.form.get('movil');
  }

  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }

  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }
  get instructorAsignado() {
    return this.form.get('instructorAsignado');
  }

  get avisoInstructor() {
    return this.form.get('avisoInstructor');
  }

  get instructorId() {
    return this.form.get('instructorId');
  }

  get instructorNombre() {
    return this.form.get('instructorNombre');
  }

  get numeroClase() {
    return this.form.get('numeroClase');
  }
  get observaciones() {
    return this.form.get('observaciones');
  }

  get aviso() {
    return this.form.get('aviso');
  }
  get claseAdicional() {
    return this.form.get('claseAdicional');
  }
  get estadoClase() {
    return this.form.get('estadoClase');
  }
  get detalle() {
    return this.form.get('detalle');
  }
  get tipoClase() {
    return this.form.get('tipoClase');
  }
  get cursoId() {
    return this.form.get('cursoId');
  }

  get cursoNombre() {
    return this.form.get('cursoNombre');
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
