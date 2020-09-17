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
import { GenerarExamen } from '../../../../core/model/generar-examen.model';
import { Instructor } from '../../../../core/model/instructor.model';
import { MovilService } from '../../../../core/services/movil.service';
import { Movil } from '../../../../core/model/movil.model';
import { SeleccionarMovilComponent } from '../seleccionar-movil/seleccionar-movil.component';
import {
  ClaseEstimada,
  ClaseEstimadaDetalle,
} from '../../../../core/model/clase-estimada.model';
import { InstructorHorasLibresComponent } from '../instructor-horas-libres/instructor-horas-libres.component';
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

  clasesAReagendar: ClaseEstimadaDetalle[] = [];

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
    console.log('aaaa .agendaClase : ', this.agendaClase);

    if (this.agendaClase.AluId) {
      this.aluId = this.agendaClase.AluId;
    }
    if (this.agendaClase.TipCurId) {
      this.tipCurId = this.agendaClase.TipCurId;
    }
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
    this.form = this.formBuilder.group({
      fechaClase: [this.agendaClase.FechaClase],
      hora: [`${this.agendaClase.Hora}:00`],
      movil: [this.agendaClase.EscMovCod],
      cursoId: [this.agendaClase.TipCurId],
      cursoNombre: [this.agendaClase.TipCurNom],
      numeroClase: [this.agendaClase.EsAgCuNroCla],
      estadoClase: [this.agendaClase.EsAgCuEst],
      claseAdicional: [this.agendaClase.EsAgCuClaAdiSN],
      tipoClase: [this.agendaClase.EsAgCuTipCla],
      escInsId: [this.agendaClase.EsAgCuInsId],
      escInsNom: [this.agendaClase.EsAgCuInsNom],
      alumnoNumero: [this.agendaClase.AluNro],
      alumnoNombre: [this.agendaClase.AluNomApe],
      reservarClasePrevia: [false],
      disponibilidadLunes: [this.data.agendaClase.disponibilidadLunes],
      disponibilidadMartes: [this.data.agendaClase.disponibilidadMartes],
      disponibilidadMiercoles: [this.data.agendaClase.disponibilidadMiercoles],
      disponibilidadJueves: [this.data.agendaClase.disponibilidadJueves],
      disponibilidadViernes: [this.data.agendaClase.disponibilidadViernes],
      disponibilidadSabado: [this.data.agendaClase.disponibilidadSabado],
      observaciones: ['', Validators.required],
    });

    this.fechaClase.disable();
    this.hora.disable();
    this.cursoNombre.disable();

    this.alumnoNombre.disable();
    this.escInsNom.disable();
  }
  seleccionarMovil() {
    this.movilService.getMoviles().subscribe((moviles: Movil[]) => {
      console.log('moviles: ', moviles);

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
        escInsId: movil.MovCod,
      });
    });
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
      this.form.patchValue({
        escInsId: result.EscInsId,
        escInsNom: result.EscInsNom,
      });
    });
  }

  seleccionarCurso() {
    this.cursoService.getCursos().subscribe((res: any) => {
      this.openDialogCursos(res);
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
      console.log('1.alumno: ' + alumno);
      console.log('2.alumno: ' + JSON.stringify(alumno));
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
    console.log('obtenerCurso - cursoId: ', cursoId);
    if (cursoId !== '') {
      this.cursoService.getCurso(cursoId).subscribe((curso: any) => {
        console.log('obtenerCurso - curso: ', curso);
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
    console.log(this.aluId);
    console.log(this.tipCurId);

    if (this.aluId === null || this.tipCurId === null) {
      return;
    }

    this.inscripcionService
      .obtenerInscripcion(this.aluId, this.tipCurId)
      .subscribe((inscripcion: Inscripcion) => {
        console.log('inscripcion: ', inscripcion);
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
    console.log(event);

    if (this.form.invalid) {
      return;
    }
    confirmacionUsuario(
      'Confirmar generación de examen',
      `Se generará un nuevo examen ${this.tituloExamen} costo para el alumno ${this.alumnoNombre.value}, ¿Desea continuar? `
    ).then((res) => {
      if (!res.isConfirmed) {
        return;
      }

      console.log(this.agendaClase.AluId);
      console.log(this.aluId);
      console.log(this.agendaClase);

      // Si reserva clase previa, evaluo si tiene clase anterior para la hora inmediatamente anterior
      if (this.reservarClasePrevia.value) {
        this.acuService
          .getClaseAgenda(
            this.agendaClase.FechaClase,
            this.agendaClase.Hora - 1,
            this.movil.value
          )
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
              this.obtenerNuevaClase(
                clasePrevia,
                clasePrevia.EsAgCuInsId
              ).then(() => this.evaluarClaseSeleccionada());
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
        EsAgCuInsId,
      };

      this.instructorService
        .getDisponibilidadInstructor(auxAgendaClase, 1)
        .subscribe((res: { ClasesEstimadas: ClaseEstimada[] }) => {
          console.log('res.ClasesEstimadas: ', res.ClasesEstimadas);
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
              this.clasesAReagendar.push(nuevaClase);

              if (finExamen) {
                resolve(this.finGenerarExamen());
              } else {
                resolve();
              }
            });
        });
    });
  }

  finGenerarExamen() {
    const generarExamen: GenerarExamen = {
      alumnoVaADarExamen: this.aluId,
      cursoParaExamen: this.tipCurId,

      clasePreviaExamen: false,
      observacionesExamen: this.observaciones.value,
      claseAnterior: this.agendaClase,
      examenConCosto: this.examenConCosto,
      instructorSeleccionado: this.escInsId.value,
      movilSeleccionado: this.movil.value,

      EscAluCurId: this.escAluCurId,
      usrId: localStorage.getItem('usrId'),
      reservarClasePrevia: this.reservarClasePrevia.value,
      clasesAReagendar: this.clasesAReagendar,
    };
    console.log(': clasesAReagendar: ', this.clasesAReagendar);

    this.inscripcionService
      .generarExamen(generarExamen)
      .subscribe((res) => console.log(res));
  }
}
