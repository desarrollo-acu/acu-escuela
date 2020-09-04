import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
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
import { SeleccionarCursoComponent } from '../seleccionar-curso/seleccionar-curso.component';
import { AcuService } from 'src/app/core/services/acu.service';
import { Curso } from '@core/model/curso.model';
import { CursoService } from '../../../../core/services/curso.service';

export interface AgendaCurso {
  TrnMode: string;
  FechaClase: string;
  Hora: number;
  EscInsId: string;
  EscInsNom: string;
  TipCurId: number;
  TipCurNom: string;
  EscAgeInsObservaciones: string;
  mensaje: string;
  UsrId: string;
}

@Component({
  selector: 'app-agenda-curso',
  templateUrl: './agenda-curso.component.html',
  styleUrls: ['./agenda-curso.component.scss'],
})
export class AgendaCursoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  selected = ' ';
  agendaCurso: AgendaCurso;
  hora: Date = new Date();
  fechaClase: Date = new Date();
  instructor: string;
  instructorAsignado = '';
  cursoNombre: string;
  hoy = new Date();

  // para el dialog
  curso: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaCursoComponent>,
    private acuService: AcuService,
    private cursoService: CursoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(
      'Estoy en el constructor de agenda-curso, la res es: ',
      this.data
    );
    this.agendaCurso = this.data.agendaCurso;
    console.log('   this.agendaCurso es: ', this.agendaCurso);
    const day = Number(
      this.agendaCurso.FechaClase.substring(
        this.agendaCurso.FechaClase.length - 2,
        this.agendaCurso.FechaClase.length
      )
    );
    const month = Number(this.agendaCurso.FechaClase.substring(5, 7));
    const year = Number(this.agendaCurso.FechaClase.substring(0, 4));

    this.fechaClase.setDate(day);
    this.fechaClase.setMonth(month - 1);
    this.fechaClase.setFullYear(year);

    this.cursoNombre = this.agendaCurso ? this.agendaCurso.TipCurNom : '';

    this.hora.setHours(this.agendaCurso.Hora, 0);
    this.instructor = this.agendaCurso.EscInsId;
    this.buildForm();
  }
  ngOnInit() {
    // toISOString, es el formato que leyo bien la api.
    localStorage.setItem('fechaClase', this.fechaClase.toISOString());
    const horaStr = this.agendaCurso.Hora * 100;
    localStorage.setItem('horaClase', horaStr.toString());
    localStorage.setItem('instructorCod', this.instructor.toString());
  }

  ngOnDestroy(): void {
    this.acuService.cleanStorageAgenda();
    //throw new Error('Method not implemented.');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private buildForm() {
    if (this.agendaCurso) {
      this.form = this.formBuilder.group({
        fechaClase: [this.fechaClase],
        instructor: [this.agendaCurso.EscInsId, [Validators.required]],
        cursoId: [
          this.agendaCurso.TipCurId,
          [Validators.required], // sync validators
          [
            // existeAlumnoValidator(this.acuService),
            // alumnoYaAsignadoValidator(this.acuService),
            // alumnoTieneExcepcionValidator(this.acuService)
          ], // async validators
        ],
        cursoNombre: [this.agendaCurso.TipCurNom, [Validators.required]],
        observaciones: [this.agendaCurso.EscAgeInsObservaciones],
      });
    } else {
      this.form = this.formBuilder.group({
        fechaClase: ['', [Validators.required]],
        instructor: ['', [Validators.required]],
        cursoId: [
          '',
          [Validators.required], // sync validators
          [
            // existeAlumnoValidator(this.acuService),
            // alumnoYaAsignadoValidator(this.acuService),
            // alumnoTieneExcepcionValidator(this.acuService)
          ], // async validators
        ],
        cursoNombre: [''],
        observaciones: [''],
      });
    }
  }

  seleccionarCurso() {
    this.cursoService.getCursos().subscribe((cursos: Curso[]) => {
      console.log('Cursos: ', cursos);

      this.openDialogCursos(cursos);
    });
  }

  private openDialogCursos(cursos: Curso[]) {
    console.log('2 Cursos: ', cursos);
    const cursosDialogRef = this.dialog.open(SeleccionarCursoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        cursos,
      },
    });

    cursosDialogRef.afterClosed().subscribe((result) => {
      this.curso = result;
      this.cursoNombre = this.agendaCurso.TipCurNom = result.TipCurNom;

      this.form.patchValue({
        cursoNombre: result.TipCurNom,
        cursoId: result.TipCurId,
      });
    });
  }

  get cursoNombreField() {
    return this.form.get('cursoNombre');
  }

  get cursoIdField() {
    return this.form.get('cursoId');
  }
  get observacionesField() {
    return this.form.get('observaciones');
  }

  obtenerCurso() {
    console.log('cursoId: ', this.cursoIdField.value);
    if (this.cursoIdField.value !== 0) {
      this.cursoService
        .getCurso(this.cursoIdField.value)
        .subscribe((res: any) => {
          console.log('res: ', res);
          this.agendaCurso.TipCurId = res.TipCurId;
          this.cursoNombre = this.agendaCurso.TipCurNom = res.TipCurNom;

          this.form.patchValue({
            cursoId: res.TipCurId,
            cursoNombre: res.TipCurNom,
          });
        });
    }
  }

  guardarClase(event: Event) {
    event.preventDefault();
    console.log('Submit, form valid: ', this.form.valid);
    console.log('Submit, form value: ', this.form.value);
    console.log('Submit, form value.cursoId: ', this.form.value.cursoId);

    if (this.form.invalid) {
      return;
    }

    const existe: boolean = JSON.parse(localStorage.getItem('existe'));

    if (this.form.valid) {
      console.log('form.value: ', this.form.value);
      this.agendaCurso.UsrId = localStorage.getItem('usrId');
      console.log('this.agendaCurso: ', this.agendaCurso);
      this.acuService
        .guardarAgendaInstructor(this.agendaCurso)
        .subscribe((res: any) => {
          console.log('res: ', res);
          console.log('mensaje: ', res.mensaje);
          this.agendaCurso.mensaje = res.mensaje;
          this.dialogRef.close(res);
        });
    }
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
