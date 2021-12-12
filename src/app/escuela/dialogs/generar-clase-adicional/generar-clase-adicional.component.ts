import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AgendaClase } from '@core/model/agenda-clase.model';
import {
  ClaseEstimada,
  ClaseEstimadaDetalle,
} from '@core/model/clase-estimada.model';
import {
  GenerarExamenItems,
} from '@core/model/generar-examen.model';
import { Inscripcion } from '@core/model/inscripcion.model';
import { Instructor } from '@core/model/instructor.model';
import { ResponseSDTCustom } from '@core/model/response-sdt-custom.model';
import { AlumnoService } from '@core/services/alumno.service';
import { CursoService } from '@core/services/curso.service';
import { InscripcionService } from '@core/services/inscripcion.service';
import { InstructorService } from '@core/services/instructor.service';
import { AgendaMovilComponent } from '@escuela/components/agenda-movil/agenda-movil.component';
import { InstructorHorasLibresComponent } from '@escuela/components/modals/instructor-horas-libres/instructor-horas-libres.component';
import { SeleccionarAlumnoComponent } from '@escuela/components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { SeleccionarInstructorComponent } from '@escuela/components/modals/seleccionar-instructor/seleccionar-instructor.component';
import {
  confirmacionUsuario,
  mensajeConfirmacion,
  errorMensaje,
} from '@utils/sweet-alert';
import Swal from 'sweetalert2';
import { SeleccionarInscripcionComponent } from '../seleccionar-inscripcion/seleccionar-inscripcion.component';
import { GenerarClaseAdicional } from '../../../core/model/generar-clase-adicional.model';
import { mensajeWarning } from '../../../utils/sweet-alert';
import { SeleccionarMovilComponent } from '@escuela/components/modals/seleccionar-movil/seleccionar-movil.component';
import { Movil } from '@core/model/movil.model';
import { MovilService } from '@core/services/movil.service';
import { MyValidatorsService } from '@utils/my-validators.service';

@Component({
  selector: 'app-generar-clase-adicional',
  templateUrl: './generar-clase-adicional.component.html',
  styleUrls: ['./generar-clase-adicional.component.scss'],
})
export class GenerarClaseAdicionalComponent implements OnInit {
  form: FormGroup;
  agendaClase: AgendaClase;

  tipCurId: number = null;
  aluId: number = null;
  instructorId: number = null;
  mostrarExamen = false;
  tituloExamen = '';
  examenConCosto = false;
  escAluCurId: number;
  esInstructor: boolean;
  esClaseAdicional: boolean;

  clasesAReagendar: GenerarExamenItems[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,
    private instructorService: InstructorService,
    private inscripcionService: InscripcionService,
    private movilService: MovilService,
    private alumnoService: AlumnoService,
    private myValidatorsService: MyValidatorsService,
    private cursoService: CursoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.agendaClase = this.data.agendaClase;
    this.esInstructor = this.data.esInstructor;
    this.esClaseAdicional = this.data.esClaseAdicional;

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
  }

  private openDialogInscripciones(inscripciones) {
    const dialogRef = this.dialog.open(SeleccionarInscripcionComponent, {
      height: 'auto',
      width: '700px',
      data: {
        inscripciones,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((inscripcion) => this.addInfoCursoToForm(inscripcion));
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
        const { AluId, AluNomComp } = alumno;
        this.myValidatorsService.alumnoTieneFacturasPendientes(AluId, AluNomComp, this.alumnoNumero);
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
          movil: inscripcion.EscMovCod
        });
      });
  }

  generarClaseAdicional(event: Event) {

    if (this.movil.value === 0) {
      this.movil.setValue(null);
    }
    if (this.form.invalid) {
      return;
    }
    confirmacionUsuario(
      'Confirmar generación de clase adicional',
      `Se generará una nueva clase adicional para el alumno ${this.alumnoNombre.value}, ¿Desea continuar? `
    ).then((res) => {
      if (!res.isConfirmed) {
        return;
      }

      const generarClaseAdicional: GenerarClaseAdicional = {
        fecha: this.agendaClase.FechaClase,
        hora: this.agendaClase.Hora,
        movilSeleccionado: this.movil.value,

        alumnoClaseAdicional: this.aluId,
        cursoClaseAdicional: this.tipCurId,
        instructorSeleccionado: this.escInsId.value,
        observacionesClaseAdicional: this.observaciones.value,
        claseAnterior: this.agendaClase,
        escAluCurId: this.escAluCurId,
        usrId: localStorage.getItem('usrId'),
      };

      console.log(generarClaseAdicional);


      if(this.esClaseAdicional){
        this.inscripcionService
          .generarClaseAdicional(generarClaseAdicional)
          .subscribe((response: ResponseSDTCustom) => this.finGeneracion(response));
      }else {
        this.inscripcionService
          .generarEvaluacionPractica(generarClaseAdicional)
          .subscribe((response: ResponseSDTCustom) => this.finGeneracion(response));
      }
    });
  }

  finGeneracion( response: ResponseSDTCustom){
    if (response.errorCode === 0) {
      mensajeConfirmacion('Excelente!', response.errorMensaje).then(() =>
        this.dialogRef.close()
      );
    } else if (response.errorCode === 2) {
      mensajeWarning('Atención', response.errorMensaje).then(() =>
        this.dialogRef.close()
      );
    } else {
      errorMensaje('Error', response.errorMensaje);
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
      const auxAgendaClase: AgendaClase = { ...agendaClase };

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
            });
        });
    });
  }
}
