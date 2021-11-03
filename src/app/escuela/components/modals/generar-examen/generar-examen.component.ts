import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

import { AcuService } from '@core/services/acu.service';
import { InstructorService } from '@core/services/instructor.service';
import { AgendaClase } from '@core/model/agenda-clase.model';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';
import { AgendaMovilComponent } from '../../agenda-movil/agenda-movil.component';
import { CursoService } from '../../../../core/services/curso.service';
import { SeleccionarCursoComponent } from '../seleccionar-curso/seleccionar-curso.component';
import { SeleccionarAlumnoComponent } from '../seleccionar-alumno/seleccionar-alumno.component';
import { AlumnoService } from '../../../../core/services/alumno.service';
import Swal from 'sweetalert2';
import { SeleccionarInstructorComponent } from '../seleccionar-instructor/seleccionar-instructor.component';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { Inscripcion } from '../../../../core/model/inscripcion.model';
import {
  GenerarExamen,
  GenerarExamenItems,
} from '../../../../core/model/generar-examen.model';
import { Instructor } from '../../../../core/model/instructor.model';
import { MovilService } from '../../../../core/services/movil.service';
import { Movil } from '../../../../core/model/movil.model';
import { SeleccionarMovilComponent } from '../seleccionar-movil/seleccionar-movil.component';
import {
  ClaseEstimada,
  ClaseEstimadaDetalle,
} from '../../../../core/model/clase-estimada.model';
import { InstructorHorasLibresComponent } from '../instructor-horas-libres/instructor-horas-libres.component';
import { SeleccionarInscripcionComponent } from '../../../dialogs/seleccionar-inscripcion/seleccionar-inscripcion.component';
import { ResponseSDTCustom } from '../../../../core/model/response-sdt-custom.model';
import { errorMensaje } from '../../../../utils/sweet-alert';
@Component({
  selector: 'app-generar-examen',
  templateUrl: './generar-examen.component.html',
  styleUrls: ['./generar-examen.component.scss'],
})
export class GenerarExamenComponent implements OnInit {
  form: FormGroup;
  agendaClase: AgendaClase;

  tipCurId: number = null;
  aluId: number = null;
  instructorId: number = null;
  mostrarExamen = false;
  tituloExamen = '';
  examenConCosto = false;
  escAluCurId: number;

  clasesAReagendar: GenerarExamenItems[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,
    private movilService: MovilService,
    private instructorService: InstructorService,
    private inscripcionService: InscripcionService,
    private alumnoService: AlumnoService,
    private acuService: AcuService,
    private cursoService: CursoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.agendaClase = this.data.agendaClase;

    if (this.agendaClase.AluId) {
      this.aluId = this.agendaClase.AluId;
    }
    if (this.agendaClase.TipCurId) {
      this.tipCurId = this.agendaClase.TipCurId;
    }
    this.obtenerInscripcion();
    this.buildForm();
  }

  ngOnInit(): void {}

  get fechaClase() {
    return this.form.get('fechaClase');
  }
  get hora() {
    return this.form.get('hora');
  }
  get movil() {
    return this.form.get('movil');
  }
  get cursoId() {
    return this.form.get('cursoId');
  }
  get cursoNombre() {
    return this.form.get('cursoNombre');
  }
  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }
  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }
  get numeroClase() {
    return this.form.get('numeroClase');
  }
  get estadoClase() {
    return this.form.get('estadoClase');
  }
  get escInsId() {
    return this.form.get('escInsId');
  }
  get escInsNom() {
    return this.form.get('escInsNom');
  }

  get claseAdicional() {
    return this.form.get('claseAdicional');
  }

  get tipoClase() {
    return this.form.get('tipoClase');
  }

  get reservarClasePrevia() {
    return this.form.get('reservarClasePrevia');
  }

  get observaciones() {
    return this.form.get('observaciones');
  }

  private buildForm() {
    const hora =
      this.agendaClase.Hora < 10
        ? `0${this.agendaClase.Hora}`
        : this.agendaClase.Hora;

    const movil =
      this.agendaClase.EscMovCod && this.agendaClase.EscMovCod !== 0
        ? this.agendaClase.EscMovCod
        : null;

    this.form = this.formBuilder.group({
      fechaClase: [this.agendaClase.FechaClase],
      hora: [`${hora}:00`],
      movil: [movil, Validators.required],
      cursoId: [this.agendaClase.TipCurId, Validators.required],
      cursoNombre: [this.agendaClase.TipCurNom],
      numeroClase: [this.agendaClase.EsAgCuNroCla],
      estadoClase: [this.agendaClase.EsAgCuEst],
      claseAdicional: [this.agendaClase.EsAgCuClaAdiSN],
      tipoClase: [this.agendaClase.EsAgCuTipCla],
      escInsId: [this.agendaClase.EsAgCuInsId, Validators.required],
      escInsNom: [this.agendaClase.EsAgCuInsNom],
      alumnoNumero: [this.agendaClase.AluNro, Validators.required],
      alumnoNombre: [this.agendaClase.AluNomApe],
      reservarClasePrevia: [false],
      disponibilidadLunes: [this.data.agendaClase.disponibilidadLunes],
      disponibilidadMartes: [this.data.agendaClase.disponibilidadMartes],
      disponibilidadMiercoles: [this.data.agendaClase.disponibilidadMiercoles],
      disponibilidadJueves: [this.data.agendaClase.disponibilidadJueves],
      disponibilidadViernes: [this.data.agendaClase.disponibilidadViernes],
      disponibilidadSabado: [this.data.agendaClase.disponibilidadSabado],
      observaciones: [''],
    });

    this.fechaClase.disable();
    this.hora.disable();
    this.cursoNombre.disable();

    this.alumnoNombre.disable();
    this.escInsNom.disable();
  }

  seleccionarMovil() {
    this.movilService.getMoviles().subscribe((moviles: Movil[]) => {
      const auxMoviles = moviles.filter((movil) => movil.EscVehEst === 'A');

      this.openDialogMoviles(auxMoviles);
    });
  }

  private openDialogMoviles(moviles: Movil[]) {
    const movilesDialogRef = this.dialog.open(SeleccionarMovilComponent, {
      height: 'auto',
      width: '700px',
      data: {
        moviles,
      },
    });

    movilesDialogRef.afterClosed().subscribe((movil) => {
      this.form.patchValue({
        movil: movil.MovCod,
      });
    });
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

  seleccionarCurso() {
    this.inscripcionService
      .getInscripcionesByAlumno(this.aluId)
      .subscribe((res: any) => this.openDialogInscripciones(res.Inscripciones));
    // this.cursoService.getCursos().subscribe((res: any) => {
    //   this.openDialogCursos(res);
    // });
  }
  private openDialogInscripciones(inscripciones) {
    const dialogRef = this.dialog.open(SeleccionarInscripcionComponent, {
      height: 'auto',
      width: '700px',
      data: {
        inscripciones,
      },
    });

    dialogRef.afterClosed().subscribe((inscripcion) => {
      this.addInfoCursoToForm(inscripcion);
    });
  }
  private openDialogCursos(cursos) {
    const cursosDialogRef = this.dialog.open(SeleccionarCursoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        cursos,
      },
    });

    cursosDialogRef.afterClosed().subscribe((curso) => {
      this.addInfoCursoToForm(curso);
    });
  }

  seleccionarAlumno() {
    this.alumnoService
      .obtenerAlumnos(5, 1, '')
      .subscribe((res: any) =>
        this.openDialogAlumnos(res.alumnos, res.cantidad)
      );
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
      if (alumno) {
        this.aluId = alumno.AluId;
        this.obtenerInscripcion();
        this.form.patchValue({
          alumnoNumero: alumno.AluNro,
          alumnoNombre: alumno.AluNomComp,
        });
      }
    });
  }

  obtenerCurso() {
    const cursoId = this.form.get('cursoId').value;

    if (cursoId !== '') {
      this.cursoService.getCurso(cursoId).subscribe((curso: any) => {
        if (curso.TipCurId === '0') {
          return Swal.fire({
            icon: 'warning',
            title: 'No encontrado!',
            text: 'El código del curso no existe, seleccione un existente.',
          }).then();
        }

        this.addInfoCursoToForm(curso);
      });
    }
  }

  addInfoCursoToForm(curso: any) {
    this.tipCurId = curso.TipCurId;
    this.obtenerInscripcion();
    this.form.patchValue({
      cursoId: curso.TipCurId,
      cursoNombre: curso.TipCurNom,
    });
  }

  obtenerInscripcion() {
    if (this.aluId === null || this.tipCurId === null) {
      return;
    }

    this.inscripcionService
      .obtenerInscripcion(this.aluId, this.tipCurId)
      .subscribe((inscripcion: Inscripcion) => {
        this.mostrarExamen = true;
        this.examenConCosto = inscripcion.cantidadExamenes > 0;
        this.tituloExamen = this.examenConCosto ? 'con' : 'sin';
        this.escAluCurId = inscripcion.EscAluCurId;

        this.form.patchValue({
          escInsId: inscripcion.EscInsId,
          escInsNom: inscripcion.EscInsNom,
        });
      });
  }

  generarExamen(event: Event) {
    if (this.movil.value === 0) {
      this.movil.setValue(null);
    }
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.invalid);

    confirmacionUsuario(
      'Confirmar generación de examen',
      `Se generará un nuevo examen ${this.tituloExamen} costo para el alumno ${this.alumnoNombre.value}, ¿Desea continuar? `
    ).then((res) => {
      if (!res.isConfirmed) {
        return;
      }

      // Si reserva clase previa, evaluo si tiene clase anterior para la hora inmediatamente anterior
      if (this.reservarClasePrevia.value) {
        this.acuService
          .getClaseAgenda(
            this.agendaClase.FechaClase,
            this.agendaClase.Hora - 1,
            this.movil.value
          )
          // tslint:disable-next-line: no-shadowed-variable
          .subscribe(({ AgendaClase }: { AgendaClase: AgendaClase }) => {
            const clasePrevia = AgendaClase;

            // Si existeClaseAgenda previa y no es del alumno que estoy
            // generando examen, entonces obtengo nueva y espero a que el usuario la seleccione.
            if (
              clasePrevia.existeClaseAgenda &&
              clasePrevia.AluId !== this.aluId &&
              // tslint:disable-next-line: triple-equals
              clasePrevia.AluId != 0
            ) {
              this.obtenerNuevaClase(clasePrevia, clasePrevia.EsAgCuInsId).then(
                () => this.evaluarClaseSeleccionada()
              );
            } else {
              this.evaluarClaseSeleccionada();
            }
          });
      }
      // Si el alumno es 0 => es un lugar libre en la agenda
      else {
        this.evaluarClaseSeleccionada();
      }
    });
  }

  /*
      Evaluar clase seleccionada quiere decir evaluar si hay
      que reagendar el turno donde se agendara el examen o no
  */
  evaluarClaseSeleccionada() {
    if (
      this.agendaClase.AluId !== this.aluId &&
      // tslint:disable-next-line: triple-equals
      this.agendaClase.AluId != 0
    ) {
      this.obtenerNuevaClase(
        this.agendaClase,
        this.escInsId.value,
        true
      ).then();
    } else {
      this.finGenerarExamen();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async obtenerNuevaClase(
    agendaClase: AgendaClase,
    EsAgCuInsId: string,
    finExamen?: boolean
  ) {
    return new Promise((resolve, reject) => {
      const auxAgendaClase: AgendaClase = {
        ...agendaClase,
      };

      this.instructorService
        .getDisponibilidadInstructor(auxAgendaClase, 1)
        .subscribe((res: { ClasesEstimadas: ClaseEstimada[] }) => {
          const arrayPlano: {
            instructorCodigo?: string;
            instructorNombre?: string;
            detalle?: ClaseEstimadaDetalle[];
          } = {};

          arrayPlano.instructorCodigo = res.ClasesEstimadas[1].EscInsId;
          arrayPlano.instructorNombre = res.ClasesEstimadas[1].EscInsNom;
          arrayPlano.detalle = [];
          res.ClasesEstimadas.forEach((clase) => {
            arrayPlano.detalle.push(...clase.Detalle);
          });

          const clasesEstimadasDialogRef = this.dialog.open(
            InstructorHorasLibresComponent,
            {
              height: 'auto',
              width: '700px',
              data: {
                clasesEstimadas: arrayPlano,
                alumno: auxAgendaClase.AluNomApe,
              },
            }
          );

          clasesEstimadasDialogRef
            .afterClosed()
            .subscribe((nuevaClase: ClaseEstimadaDetalle) => {
              const claseAReagendar: GenerarExamenItems = {
                clasePrevia: auxAgendaClase,
                detalle: nuevaClase,
              };
              this.clasesAReagendar.push(claseAReagendar);
              if (finExamen) {
                resolve(this.finGenerarExamen());
              } else {
                resolve(null);
              }
            });
        });
    });
  }

  finGenerarExamen() {
    // Si hay items en clasesAReagender, entonces reagenda clase.
    const reagendaClase: boolean = this.clasesAReagendar.length > 0;
    const instructorSeleccionado: string =
      this.escInsId.value.toLocaleUpperCase();

    const generarExamen: GenerarExamen = {
      alumnoVaADarExamen: this.aluId,
      cursoParaExamen: this.tipCurId,
      observacionesExamen: this.observaciones.value,
      claseAnterior: this.agendaClase,
      examenConCosto: this.examenConCosto,
      instructorSeleccionado,
      movilSeleccionado: this.movil.value,
      reagendaClase,
      EscAluCurId: this.escAluCurId,
      usrId: localStorage.getItem('usrId'),
      reservarClasePrevia: this.reservarClasePrevia.value,
      clasesAReagendar: this.clasesAReagendar,
    };

    this.inscripcionService
      .generarExamen(generarExamen)
      .subscribe((response: ResponseSDTCustom) => {
        if (response.errorCode === 0) {
          mensajeConfirmacion('Excelente!', response.errorMensaje).then(() =>
            this.dialogRef.close()
          );
        } else {
          errorMensaje('Error', response.errorMensaje);
        }
      });
  }
}
