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
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { SeleccionarCursoComponent } from '../seleccionar-curso/seleccionar-curso.component';

import { MyErrorStateMatcher } from '../agendar-clase/agendar-clase.component';
import { SeleccionarAlumnoComponent } from '../seleccionar-alumno/seleccionar-alumno.component';
import { AltaAlumnoComponent } from '../alta-alumno/alta-alumno.component';
import { FacturaRutComponent } from '../factura-rut/factura-rut.component';
import { SeleccionarItemsFacturarComponent } from '../seleccionar-items-facturar/seleccionar-items-facturar.component';
import { AgendaMovilComponent } from '../../agenda-movil/agenda-movil.component';
import { AcuService } from 'src/app/core/services/acu.service';
import { ResponseFacturaRUT } from 'src/app/core/model/responseFacturaRUT.model';
import { ValidateFechaPosterior } from 'src/app/utils/custom-validator';
import { MyValidators } from 'src/app/utils/validators';
import { InscripcionCurso } from '@core/model/inscripcion-curso.model';
import { ClasesEstimadasComponent } from '../clases-estimadas/clases-estimadas.component';
import { mensajeConfirmacion } from '@utils/sweet-alert';

import { Alumno } from '@core/model/alumno.model';
import { AlumnoYaAsignadoValidatorDirective } from '@utils/validators/alumno-ya-asignado.directive';
import { formatCI } from '@utils/utils-functions';
import { InscripcionService } from '@core/services/inscripcion.service';
import { CursoService } from '@core/services/curso.service';
import { AlumnoService } from '@core/services/alumno.service';
import { InstructorService } from '@core/services/instructor.service';
import {
  confirmacionUsuario,
  mensajeWarning,
} from '../../../../utils/sweet-alert';
import { Prefactura } from '../../../../core/model/prefactura.model';
import { openSamePDF } from '../../../../utils/utils-functions';
import { Subscription } from 'rxjs';
import { NullTemplateVisitor } from '@angular/compiler';
import { ClaseEstimada } from '@core/model/clase-estimada.model';

@Component({
  selector: 'app-inscripcion-curso',
  templateUrl: './inscripcion-curso.component.html',
  styleUrls: ['./inscripcion-curso.component.scss'],
})
export class InscripcionCursoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  selected = ' ';
  inscripcionCurso: InscripcionCurso;
  hora: Date = new Date();
  fechaClase: Date = new Date();
  instructor: string;
  instructorAsignado = '';
  cursoNombre: string;
  hoy = new Date();
  toppings = new FormControl();
  toppingList: string[] = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];
  horasLibres = [];
  sedes = [];

  alumno: Alumno;

  // para el dialog
  curso: any;

  // validacionesFecha
  fecha1: Date;
  fecha2: Date;
  fecha3: Date;

  alumnoNumeroSubs: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,
    private acuService: AcuService,
    private inscripcionService: InscripcionService,
    private instructorService: InstructorService,
    private cursoService: CursoService,
    private alumnoService: AlumnoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.inscripcionCurso = this.data.inscripcionCurso;

    // tslint:disable-next-line: max-line-length
    const day = Number(
      this.inscripcionCurso.FechaClase.substring(
        this.inscripcionCurso.FechaClase.length - 2,
        this.inscripcionCurso.FechaClase.length
      )
    );
    const month = Number(this.inscripcionCurso.FechaClase.substring(5, 7));
    const year = Number(this.inscripcionCurso.FechaClase.substring(0, 4));

    this.fechaClase.setDate(day);
    this.fechaClase.setMonth(month - 1);
    this.fechaClase.setFullYear(year);
    this.generateHorasLibres();
    this.generateSedes();
    this.buildForm();
    this.deshabilitarCampos();
  }
  ngOnDestroy(): void {
    this.alumnoNumeroSubs.unsubscribe();
  }
  ngOnInit(): void {
    const input = document.getElementById('searchAlumno');

    let timeout = null;

    input.addEventListener('keyup', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.obtenerAlumno(), 1000);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        fechaClase: [this.fechaClase, [MyValidators.fechaPosteriorAHoy]],
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
        cursoClasesPracticas: [''],
        cursoClasesTeoricas: [''],
        cursoExamenPractico: [''],
        cursoExamenTeorico: [''],
        fechaInicioEstimada: ['', Validators.required],
        escCurTe1: [''],
        escCurTe2: [''],
        escCurTe3: [''],
        escCurIni: [''],
        alumnoNumero: [
          '',
          [Validators.required], // sync validators
          // [
          //   existeAlumnoValidator(this.acuService),
          //   alumnoYaAsignadoValidator(this.acuService),
          //   alumnoTieneExcepcionValidator(this.acuService)
          // ] // async validators
        ],
        alumnoNombre: [''],
        alumnoCI: [null],
        alumnoTelefono: [''],
        alumnoCelular: [''],
        sede: [''],
        irABuscarAlAlumno: [false],

        documentosEntregadosYFirmados: [false],
        reglamentoEscuela: [false],
        condicionesCurso: [false],
        eLearning: [false],

        examenMedico: [false],
        licenciaCedulaIdentidad: [false],
        pagoDeLicencia: [false],

        fechaLicCedulaIdentidad: [''],
        fechaPagoLicencia: [''],
        fechaExamenMedico: [''],

        disponibilidadLunes: [''],
        disponibilidadMartes: [''],
        disponibilidadMiercoles: [''],
        disponibilidadJueves: [''],
        disponibilidadViernes: [''],
        disponibilidadSabado: [''],
        observaciones: [''],
      },
      {
        validator: [
          ValidateFechaPosterior('escCurIni', 'escCurTe1'),
          ValidateFechaPosterior('escCurTe1', 'escCurTe2'),
          ValidateFechaPosterior('escCurTe2', 'escCurTe3'),
        ],
      }
    );
  }

  deshabilitarCampos() {
    // Deshabilitar fecha de inscripicón
    this.fechaClaseFiled.disable();

    // Campos deshabilitados del alumno
    // this.alumnoCIField.disable();
    this.alumnoNumeroField.disable();
    this.alumnoTelefonoField.disable();
    this.alumnoNombreField.disable();
    this.alumnoCelularField.disable();

    // Campos deshabilitados del curso

    this.cursoNombreField.disable();
    this.cursoClasesPracticasField.disable();
    this.cursoClasesTeoricasField.disable();
    this.cursoExamenPracticoField.disable();
    this.cursoExamenTeoricoField.disable();
  }

  seleccionarCurso() {
    let cursos = JSON.parse(localStorage.getItem('Cursos'));

    if (!cursos) {
      this.cursoService.getCursos().subscribe((res: any) => {
        cursos = res;
        localStorage.setItem('cursos', JSON.stringify(cursos));
        this.openDialogCursos(cursos);
      });
    } else {
      this.openDialogCursos(cursos);
    }
  }

  cambiarDiaFecha1(type: string, event: MatDatepickerInputEvent<Date>) {
    this.fecha1 = event.value;
  }
  cambiarDiaFecha2(type: string, event: MatDatepickerInputEvent<Date>) {
    this.fecha2 = event.value;
  }
  cambiarDiaFecha3(type: string, event: MatDatepickerInputEvent<Date>) {
    this.fecha3 = event.value;
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
      this.inscripcionCurso.TipCurId = result.TipCurId;
      this.inscripcionCurso.TipCurNom = result.TipCurNom;
      this.addInfoCursoToForm(result);
    });
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
          }).then();
        }

        res.TipCurId = cursoId;
        this.inscripcionCurso.TipCurId = res.TipCurId;
        this.inscripcionCurso.TipCurNom = res.TipCurNom;
        this.addInfoCursoToForm(res);
      });
    }
  }

  addInfoCursoToForm(result: any) {
    const examenPractico = result.TipCurExaPra === 'S';
    const examenTeorico = result.TipCurExaTeo === 'S';
    const escCurIni = new Date();
    this.form.patchValue({
      cursoId: result.TipCurId,
      cursoNombre: result.TipCurNom,
      cursoClasesPracticas: result.TipCurClaPra,
      cursoClasesTeoricas: result.TipCurClaTeo,
      cursoExamenPractico: examenPractico,
      cursoExamenTeorico: examenTeorico,
      escCurIni,
    });
  }

  seleccionarAlumno() {
    this.alumnoService.obtenerAlumnos(5, 1, '').subscribe((res: any) => {
      this.openDialogAlumnos(res.Alumnos, res.Cantidad);
    });
  }

  altaAlumno() {
    this.openDialogAltaAlumnos();
  }

  obtenerAlumno() {
    this.alumnoService
      .obtenerAlumnoByCI(this.alumnoCIField.value)
      .subscribe((res: { Alumnos: Alumno[] }) =>
        res.Alumnos.length === 0
          ? mensajeWarning(
              'Atención',
              `El alumno con cedula ${this.alumnoCIField.value} no existe en el sistema, haga click en el botón "+" para darlo de alta.`
            ).then()
          : this.addInfoAlumnoAlForm(res.Alumnos[0])
      );
  }
  private openDialogAltaAlumnos() {
    this.alumnoService
      .getAlumnoNumero()
      .subscribe((alumno: { numero: number }) => {
        const alumnosDialogRef = this.dialog.open(AltaAlumnoComponent, {
          height: 'auto',
          width: '700px',
          data: {
            alumnoNumero: alumno.numero,
          },
        });

        alumnosDialogRef.afterClosed().subscribe((result) => {
          this.addInfoAlumnoAlForm(result.Alumno);
        });
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

    alumnosDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addInfoAlumnoAlForm(result);
      }
    });
  }

  guardarClase(event: Event) {
    event.preventDefault();

    if (this.form.invalid) {
      return;
    }

    if (this.form.valid) {
      this.inscripcionCurso.disponibilidadLunes = this.disponibilidadLunesField.value;
      this.inscripcionCurso.disponibilidadMartes = this.disponibilidadMartesField.value;
      this.inscripcionCurso.disponibilidadMiercoles = this.disponibilidadMiercolesField.value;
      this.inscripcionCurso.disponibilidadJueves = this.disponibilidadJuevesField.value;
      this.inscripcionCurso.disponibilidadViernes = this.disponibilidadViernesField.value;
      this.inscripcionCurso.disponibilidadSabado = this.disponibilidadSabadoField.value;
    }

    if (
      this.inscripcionCurso.disponibilidadLunes.length > 0 ||
      this.inscripcionCurso.disponibilidadMartes.length > 0 ||
      this.inscripcionCurso.disponibilidadMiercoles.length > 0 ||
      this.inscripcionCurso.disponibilidadJueves.length > 0 ||
      this.inscripcionCurso.disponibilidadViernes.length > 0 ||
      this.inscripcionCurso.disponibilidadSabado.length > 0
    ) {
      // Obtener clases estimadas;
      this.clasesEstimadas();
    } else {
      // Factura con RUT;
      this.openDialogFacturaRUT();
    }
  }

  clasesEstimadas() {
    this.inscripcionCurso.disponibilidadLunes = this.disponibilidadLunesField.value;
    this.inscripcionCurso.disponibilidadMartes = this.disponibilidadMartesField.value;
    this.inscripcionCurso.disponibilidadMiercoles = this.disponibilidadMiercolesField.value;
    this.inscripcionCurso.disponibilidadJueves = this.disponibilidadJuevesField.value;
    this.inscripcionCurso.disponibilidadViernes = this.disponibilidadViernesField.value;
    this.inscripcionCurso.disponibilidadSabado = this.disponibilidadSabadoField.value;

    this.inscripcionCurso.escCurTe1 = this.escCurTe1Field.value;
    this.inscripcionCurso.escCurTe2 = this.escCurTe2Field.value;
    this.inscripcionCurso.escCurTe3 = this.escCurTe3Field.value;
    this.inscripcionCurso.fechaClaseEstimada = this.fechaInicioEstimadaField.value;
    this.inscripcionCurso.TipCurId = this.cursoIdField.value;

    this.instructorService
      .getClasesEstimadas(this.inscripcionCurso)
      .subscribe((clasesEstimadas) => {
        const clasesEstimadasDialogRef = this.dialog.open(
          ClasesEstimadasComponent,
          {
            height: 'auto',
            width: '700px',
            data: {
              clasesEstimadas,
            },
          }
        );

        clasesEstimadasDialogRef
          .afterClosed()
          .subscribe(
            (result: { continuar: boolean; claseEstimada: ClaseEstimada }) => {


              this.salir(result);

              if (!result.continuar) {
                return;
              }

              this.acuService
                .getPDFPlanDeClases(result.claseEstimada)
                .subscribe((pdf) => {
                  openSamePDF(pdf, 'PlanDeClases');
                });

              this.inscripcionCurso.ClasesEstimadas = result.claseEstimada;


              this.openDialogFacturaRUT();
            }
          );
      });
  }

  private openDialogFacturaRUT() {


    const facturaRUTDialogRef = this.dialog.open(FacturaRutComponent, {
      height: 'auto',
      width: '700px',
    });

    facturaRUTDialogRef
      .afterClosed()
      .subscribe(
        (result: { continuar: boolean; factura: ResponseFacturaRUT }) => {
          this.salir(result);

          if (!(result && result.continuar)) {
            this.clasesEstimadas();
            return;
          } else {
            this.inscripcionCurso.facturaEstadoPendiente = false;
            if (result.factura) {
              this.inscripcionCurso.FacturaRut = result.factura;

              if (result.factura.generaFactura) {
                this.inscripcionCurso.facturaEstadoPendiente = true;
                this.cursoService
                  .getItemsPorCurso(this.inscripcionCurso.TipCurId)
                  .subscribe((itemsCurso: any) => {
                    this.openDialogSeleccionarItemsFactura(
                      result.factura,
                      itemsCurso.Items
                    );
                  });
              } else {
                this.generarInscripcion();
              }
            } else {
              this.generarInscripcion();
            }
          }
        }
      );
  }

  private openDialogSeleccionarItemsFactura(
    facturaRUT: ResponseFacturaRUT,
    items: any
  ) {
    const prefactura: Prefactura = {
      AluId: this.inscripcionCurso.AluId,
      EscCurEmp: facturaRUT.RUT,
      FacDto: facturaRUT.descuento,
      UsrId: this.inscripcionCurso.UsrId,
    };

    const seleccionarItemsFactura = this.dialog.open(
      SeleccionarItemsFacturarComponent,
      {
        height: 'auto',
        width: '700px',
        data: {
          TipCurId: this.cursoIdField.value,
          items,
          titulo: 'Seleccionar Items a Facturar',
          esFactura: true,
          prefactura,
        },
      }
    );

    seleccionarItemsFactura
      .afterClosed()
      .subscribe((result: { continuar: boolean; itemFacturar: any }) => {
        this.salir(result);
        if (!(result || result.continuar)) {
          this.openDialogFacturaRUT();
          return;
        } else {

          this.inscripcionCurso.facturaEstadoPendiente = true;
          if (result && result.itemFacturar) {
            this.inscripcionCurso.SeleccionarItemsFactura = {
              TipCurId: result.itemFacturar.TipCurId,
              EscItemCod: result.itemFacturar.EscItemCod,
              EscItemDesc: result.itemFacturar.EscItemDesc,
              EscCurIteClaAdi: result.itemFacturar.EscCurIteClaAdi,
            };

            this.inscripcionCurso.facturaEstadoPendiente = false;
            this.generarInscripcion();
          } else {
            this.generarInscripcion();
          }
        }
      });
  }

  changeLicenciaCedulaIdentidad(event: MatCheckboxChange) {
    if (event.checked) {
      return this.fechaLicCedulaIdentidadField.setValue(new Date());
    }

    return this.fechaLicCedulaIdentidadField.setValue('');
  }

  changeExamenMedico(event: MatCheckboxChange) {
    if (event.checked) {
      return this.fechaExamenMedicoField.setValue(new Date());
    }

    return this.fechaExamenMedicoField.setValue('');
  }

  changePagoLicencia(event: MatCheckboxChange) {
    if (event.checked) {
      return this.fechaPagoLicenciaField.setValue(new Date());
    }

    return this.fechaPagoLicenciaField.setValue('');
  }

  addInfoAlumnoAlForm(result: Alumno) {
    this.inscripcionCurso.AluId = result.AluId;

    const ci =
      typeof result.AluCI === 'string' ? result.AluCI : result.AluCI.toString();
    const dv =
      typeof result.AluDV === 'string' ? result.AluDV : result.AluDV.toString();

    this.form.patchValue({
      alumnoNumero: result.AluNro,
      alumnoNombre: result.AluNomComp,
      alumnoCI: result.AluCI, //formatCI(ci, dv),
      alumnoTelefono: result.AluTel1,
      alumnoCelular: result.AluTel2,
    });
  }

  generarInscripcion() {
    this.inscripcionCurso.escCurIni = this.escCurIniField.value;
    this.inscripcionCurso.escCurFchIns = this.fechaClaseFiled.value;
    this.inscripcionCurso.escCurTe1 = this.escCurTe1Field.value;
    this.inscripcionCurso.escCurTe2 = this.escCurTe2Field.value;
    this.inscripcionCurso.escCurTe3 = this.escCurTe3Field.value;

    this.inscripcionCurso.sede = this.sedeField.value;
    this.inscripcionCurso.irABuscarAlAlumno = this.irABuscarAlAlumnoField.value;

    this.inscripcionCurso.condicionesCurso = this.condicionesCursoField.value;
    this.inscripcionCurso.reglamentoEscuela = this.reglamentoEscuelaField.value;
    this.inscripcionCurso.documentosEntregadosYFirmados = this.documentosEntregadosYFirmadosField.value;
    this.inscripcionCurso.eLearning = this.eLearningField.value;

    this.inscripcionCurso.examenMedico = this.examenMedicoField.value;
    this.inscripcionCurso.licenciaCedulaIdentidad = this.licenciaCedulaIdentidadField.value;
    this.inscripcionCurso.pagoDeLicencia = this.pagoDeLicenciaField.value;

    this.inscripcionCurso.fechaExamenMedico = this.fechaExamenMedicoField.value;
    this.inscripcionCurso.fechaLicCedulaIdentidad = this.fechaLicCedulaIdentidadField.value;
    this.inscripcionCurso.fechaPagoLicencia = this.fechaPagoLicenciaField.value;


    this.inscripcionService
      .generarInscripcion(this.inscripcionCurso)
      .subscribe((res: any) => {
        this.inscripcionCurso.mensaje = res.errorMensaje;
        mensajeConfirmacion('Excelente!', res.errorMensaje);
        this.dialogRef.close(this.inscripcionCurso);
      });
  }

  private salir(result) {

    if (result && result.salir) {
      this.dialogRef.close();
    }
  }

  get fechaClaseFiled() {
    return this.form.get('fechaClase');
  }

  get sedeField() {
    return this.form.get('sede');
  }
  get fechaInicioEstimadaField() {
    return this.form.get('fechaInicioEstimada');
  }

  get irABuscarAlAlumnoField() {
    return this.form.get('irABuscarAlAlumno');
  }
  get alumnoNumeroField() {
    return this.form.get('alumnoNumero');
  }

  get alumnoNombreField() {
    return this.form.get('alumnoNombre');
  }

  get alumnoCIField() {
    return this.form.get('alumnoCI');
  }

  get alumnoTelefonoField() {
    return this.form.get('alumnoTelefono');
  }

  get alumnoCelularField() {
    return this.form.get('alumnoCelular');
  }

  get cursoIdField() {
    return this.form.get('cursoId');
  }
  get cursoNombreField() {
    return this.form.get('cursoNombre');
  }
  get cursoClasesPracticasField() {
    return this.form.get('cursoClasesPracticas');
  }
  get cursoClasesTeoricasField() {
    return this.form.get('cursoClasesTeoricas');
  }

  get cursoExamenPracticoField() {
    return this.form.get('cursoExamenPractico');
  }

  get documentosEntregadosYFirmadosField() {
    return this.form.get('documentosEntregadosYFirmados');
  }

  get reglamentoEscuelaField() {
    return this.form.get('reglamentoEscuela');
  }

  get condicionesCursoField() {
    return this.form.get('condicionesCurso');
  }

  get eLearningField() {
    return this.form.get('eLearning');
  }

  get examenMedicoField() {
    return this.form.get('examenMedico');
  }

  get licenciaCedulaIdentidadField() {
    return this.form.get('licenciaCedulaIdentidad');
  }

  get pagoDeLicenciaField() {
    return this.form.get('pagoDeLicencia');
  }

  get fechaLicCedulaIdentidadField() {
    return this.form.get('fechaLicCedulaIdentidad');
  }

  get fechaPagoLicenciaField() {
    return this.form.get('fechaPagoLicencia');
  }

  get fechaExamenMedicoField() {
    return this.form.get('fechaExamenMedico');
  }

  get cursoExamenTeoricoField() {
    return this.form.get('cursoExamenTeorico');
  }

  get escCurTe1Field() {
    return this.form.get('escCurTe1');
  }

  get escCurTe2Field() {
    return this.form.get('escCurTe2');
  }
  get escCurTe3Field() {
    return this.form.get('escCurTe3');
  }
  get escCurIniField() {
    return this.form.get('escCurIni');
  }

  get disponibilidadLunesField() {
    return this.form.get('disponibilidadLunes');
  }

  get disponibilidadMartesField() {
    return this.form.get('disponibilidadMartes');
  }

  get disponibilidadMiercolesField() {
    return this.form.get('disponibilidadMiercoles');
  }

  get disponibilidadJuevesField() {
    return this.form.get('disponibilidadJueves');
  }

  get disponibilidadViernesField() {
    return this.form.get('disponibilidadViernes');
  }

  get disponibilidadSabadoField() {
    return this.form.get('disponibilidadSabado');
  }

  generateSedes() {
    const sede1 = {
      id: 1,
      value: 'Colonia y Yi',
      description: 'Colonia y Yi',
    };
    this.sedes.push(sede1);

    const sede2 = {
      id: 2,
      value: 'BASE-CARRASCO',
      description: 'BASE CARRASCO',
    };
    this.sedes.push(sede2);
  }

  generateHorasLibres() {
    for (let i = 6; i < 20; i++) {
      const horaIni = i;
      const horaFin = i + 1;
      const o = {
        value: `${horaIni * 100}-${horaFin * 100}`,
        description: `${horaIni}:00 - ${horaFin}:00`,
        horaIni: `${horaIni * 100}`,
        horaFin: `${horaFin * 100}`,
      };
      this.horasLibres.push(o);
    }
  }
}
