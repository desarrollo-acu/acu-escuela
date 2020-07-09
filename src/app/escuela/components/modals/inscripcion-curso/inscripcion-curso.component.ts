import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SeleccionarCursoComponent } from '../seleccionar-curso/seleccionar-curso.component';

import { MyErrorStateMatcher } from '../agendar-clase/agendar-clase.component';
import { SeleccionarAlumnoComponent } from '../seleccionar-alumno/seleccionar-alumno.component';
import { AltaAlumnoComponent } from '../alta-alumno/alta-alumno.component';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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


@Component({
  selector: 'app-inscripcion-curso',
  templateUrl: './inscripcion-curso.component.html',
  styleUrls: ['./inscripcion-curso.component.scss']
})
export class InscripcionCursoComponent {



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
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  horasLibres = [];
  sedes = [];

  alumno: Alumno;

  // para el dialog
  curso: any;

  // validacionesFecha
  fecha1: Date;
  fecha2: Date;
  fecha3: Date;


  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,
    private acuService: AcuService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('Estoy en el constructor de agenda-curso, la res es: ', this.data);
    this.inscripcionCurso = this.data.inscripcionCurso;

    // tslint:disable-next-line: max-line-length
    const day = Number(this.inscripcionCurso.FechaClase.substring(this.inscripcionCurso.FechaClase.length - 2, this.inscripcionCurso.FechaClase.length));
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

  onNoClick(): void {
    this.dialogRef.close();
  }


  private buildForm() {
    this.form = this.formBuilder.group({
      fechaClase: [this.fechaClase, [MyValidators.fechaPosteriorAHoy]],
      cursoId: [
        '',
        [Validators.required], // sync validators
        [
          // existeAlumnoValidator(this.acuService),
          // alumnoYaAsignadoValidator(this.acuService),
          // alumnoTieneExcepcionValidator(this.acuService)
        ] // async validators
      ],
      cursoNombre: [''],
      cursoClasesPracticas: [''],
      cursoClasesTeoricas: [''],
      cursoExamenPractico: [''],
      cursoExamenTeorico: [''],
      fechaInicioEstimada: ['', Validators.required],
      escCurTe1: ['', Validators.required],
      escCurTe2: ['', Validators.required],
      escCurTe3: ['', Validators.required],
      escCurIni: ['', [Validators.required, MyValidators.fechaAnteriorAHoy]],
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
      alumnoCI: [''],
      alumnoTelefono: [''],
      alumnoCelular: [''],
      sede: [''],
      irABuscarAlAlumno: [false],
      disponibilidadLunes: [''],
      disponibilidadMartes: [''],
      disponibilidadMiercoles: [''],
      disponibilidadJueves: [''],
      disponibilidadViernes: [''],
      disponibilidadSabado: [''],
      observaciones: ['']
    }, {
      validator: [
        ValidateFechaPosterior('escCurIni', 'escCurTe1'),
        ValidateFechaPosterior('escCurTe1', 'escCurTe2'),
        ValidateFechaPosterior('escCurTe2', 'escCurTe3')]
    });

  }

  deshabilitarCampos() {
    // Deshabilitar fecha de inscripicón
    this.fechaClaseFiled.disable();

    // Campos deshabilitados del alumno
    this.alumnoCIField.disable();
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
      this.acuService.getCursos()
        .subscribe((res: any) => {
          console.log('Cursos: ', res);

          cursos = res;
          console.log('cursos: ', cursos);
          localStorage.setItem('cursos', JSON.stringify(cursos));
          this.openDialogCursos(cursos);
        });
    } else {
      this.openDialogCursos(cursos);
    }
  }

  cambiarDiaFecha1(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('cambiarDiaFecha1');
    console.log(`${type}: ${event.value}`);
    this.fecha1 = event.value;
  }
  cambiarDiaFecha2(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('cambiarDiaFecha2');
    console.log(`${type}: ${event.value}`);
    this.fecha2 = event.value;
  }
  cambiarDiaFecha3(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('cambiarDiaFecha3');
    console.log(`${type}: ${event.value}`);
    this.fecha3 = event.value;
  }

  private openDialogCursos(cursos) {
    const cursosDialogRef = this.dialog.open(SeleccionarCursoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        cursos,
      }
    });

    cursosDialogRef.afterClosed().subscribe(result => {
      console.log('result: ', result);
      this.curso = result;
      this.inscripcionCurso.TipCurId = result.TipCurId;
      this.inscripcionCurso.TipCurNom = result.TipCurNom;
      this.addInfoCursoToForm(result);

    });

  }

  obtenerCurso() {
    const cursoId = this.form.get('cursoId').value;
    console.log('obtenerCurso - cursoId: ', cursoId);
    if (cursoId !== '') {

      this.acuService.getCurso(cursoId)
        .subscribe((res: any) => {
          console.log('obtenerCurso - res: ', res);
          if (res.TipCurId === '0') {

            Swal.fire({
              icon: 'warning',
              title: 'No encontrado!',
              text: 'El código del curso no existe, seleccione un existente.'
            }).then((res2) => {
              if (res2.dismiss === Swal.DismissReason.timer) {
                console.log('Cierro  con ela timer');
              }
            });
          }

          res.TipCurId = cursoId;
          this.inscripcionCurso.TipCurId = res.TipCurId;
          this.inscripcionCurso.TipCurNom = res.TipCurNom;
          this.addInfoCursoToForm(res);
        });

    }
  }

  addInfoCursoToForm(result: any) {

    const examenPractico = (result.TipCurExaPra === 'S');
    const examenTeorico = (result.TipCurExaTeo === 'S');
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
    // let alumnos = JSON.parse(localStorage.getItem('Alumnos'));

    // let cantidad = localStorage.getItem('Cantidad');



    // if (!alumnos) {

    this.acuService.obtenerAlumnos(5, 1, '')
      .subscribe((res: any) => {
        console.log('res: ', res);
        console.log('res.Cantidad: ', res.Cantidad);
        console.log('res.Alumnos: ', res.Alumnos);
        // alumnos = res.Alumnos;
        // cantidad = res.Cantidad;
        // localStorage.setItem('Alumnos', JSON.stringify(alumnos));
        // localStorage.setItem('Cantidad', cantidad);

        this.openDialogAlumnos(res.Alumnos, res.Cantidad);
      });

    // } else {
    //   this.openDialogAlumnos(alumnos, cantidad);
    // }
  }


  altaAlumno() {
    this.openDialogAltaAlumnos();
  }

  private openDialogAltaAlumnos() {
    this.acuService.getAlumnoNumero().subscribe((alumno: { numero: number }) => {
      console.log('alumno: ', alumno);

      const alumnosDialogRef = this.dialog.open(AltaAlumnoComponent, {
        height: 'auto',
        width: '700px',
        data: {
          alumnoNumero: alumno.numero
        }
      });

      alumnosDialogRef.afterClosed().subscribe(result => {
        // this.alumno = result;
        console.log('1.alumno: ' + result);
        console.log('2.alumno: ' + JSON.stringify(result));

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
        cantidad
      }
    });

    alumnosDialogRef.afterClosed().subscribe(result => {
      // this.alumno = result;
      console.log('1.alumno: ' + result);
      console.log('2.alumno: ' + JSON.stringify(result));
      if (result) {
        this.addInfoAlumnoAlForm(result);
      }
    });

  }

  guardarClase(event: Event) {
    event.preventDefault();
    console.log('Submit, form valid: ', this.form.valid);
    console.log('Submit, form value: ', this.form.value);
    console.log('Submit, form value.cursoId: ', this.form.value.cursoId);

    if (this.form.invalid) {
      console.log('Submit, form invalid: ', this.form.invalid);
      return;
    }


    const existe: boolean = JSON.parse(localStorage.getItem('existe'));

    if (this.form.valid) {
      console.log('form.value: ', this.form.value);
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
      this.inscripcionCurso.sede = this.sedeField.value;
      this.inscripcionCurso.irABuscarAlAlumno = this.irABuscarAlAlumnoField.value;
      console.log('this.inscripcionCurso: ', this.inscripcionCurso);
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
    this.acuService.getClasesEstimadas(this.inscripcionCurso).subscribe((clasesEstimadas) => {
      console.log('clasesEstimadas: ', clasesEstimadas);

      const clasesEstimadasDialogRef = this.dialog.open(ClasesEstimadasComponent, {
        height: 'auto',
        width: '700px',
        data: {
          clasesEstimadas
        }
      });


      clasesEstimadasDialogRef.afterClosed().subscribe((result: any) => {
        // this.alumno = result;
        console.log('1.response: ' + result);
        console.log('2.response: ' + JSON.stringify(result));
        console.log(`2. response ${result}`);

        this.inscripcionCurso.ClasesEstimadas = result;

        this.openDialogFacturaRUT();
      });

    });



  }

  private openDialogFacturaRUT() {
    const facturaRUTDialogRef = this.dialog.open(FacturaRutComponent, {
      height: 'auto',
      width: '700px'
    });

    facturaRUTDialogRef.afterClosed().subscribe((result: ResponseFacturaRUT) => {
      // this.alumno = result;
      console.log('1.response: ' + result);
      console.log('2.response: ' + JSON.stringify(result));
      console.log(`2. response ${result}`);


      this.inscripcionCurso.facturaEstadoPendiente = true;
      if (result) {
        this.inscripcionCurso.FacturaRut = result;

        if (result.generaFactura) {
          this.acuService.getItemsPorCurso(this.inscripcionCurso.TipCurId).subscribe((itemsCurso: any) => {
            console.log('itemsCurso: ', itemsCurso);

            this.openDialogSeleccionarItemsFactura(result, itemsCurso.Items);
          });
        } else {
          this.inscripcionCurso.facturaEstadoPendiente = false;
          this.generarInscripcion();
        }

      } else {
        this.inscripcionCurso.facturaEstadoPendiente = false;
        this.generarInscripcion();

      }
    });

  }


  private openDialogSeleccionarItemsFactura(facturaRUT: ResponseFacturaRUT, items: any) {

    const seleccionarItemsFactura = this.dialog.open(SeleccionarItemsFacturarComponent, {
      height: 'auto',
      width: '700px',
      data: {
        TipCurId: this.cursoIdField.value,
        items,
        titulo: 'Seleccionar Items a Facturar',
        esFactura: true,
      }
    });

    seleccionarItemsFactura.afterClosed().subscribe(result => {
      // this.alumno = result;
      console.log('1.response: ', result);
      console.log('2.response: ', JSON.stringify(result));

      this.inscripcionCurso.facturaEstadoPendiente = true;
      if (result) {
        this.inscripcionCurso.SeleccionarItemsFactura = {
          TipCurId: result.TipCurId,
          EscItemCod: result.EscItemCod,
          EscItemDesc: result.EscItemDesc,
          EscCurIteClaAdi: result.EscCurIteClaAdi,
        };

        this.confirmacionUsuario(
          'Confirmación de Usuario',
          'Se generará la factura correspondiente, desea continuar?')
          .then((res) => {
            if (res.value) {
              this.inscripcionCurso.facturaEstadoPendiente = false;
              console.log('casi fin, a un 90%: ', this.inscripcionCurso);
              //  this.accionGeneralDia('liberar');
            }
            this.generarInscripcion();
          });

      } else {
        this.generarInscripcion();
      }

    });


  }

  addInfoAlumnoAlForm(result: Alumno) {

    this.inscripcionCurso.AluId = result.AluId;

    console.log('result: ', result);
    console.log('CI tipo: ', typeof result.AluCI);
    console.log('DV tipo: ', typeof result.AluDV);

    const ci = (typeof result.AluCI === 'string') ? result.AluCI : result.AluCI.toString();
    const dv = (typeof result.AluDV === 'string') ? result.AluDV : result.AluDV.toString();

    this.form.patchValue({
      alumnoNumero: result.AluNro,
      alumnoNombre: result.AluNomComp,
      alumnoCI: this.formatCI(ci, dv),
      alumnoTelefono: result.AluTel1,
      alumnoCelular: result.AluTel2,
    });

  }

  generarInscripcion() {
    console.log('generarInscripcion ::: .inscripcionCurso: ', this.inscripcionCurso);

    this.acuService.generarInscripcion(this.inscripcionCurso)
      .subscribe((res: any) => {
        console.log('res: ', res);
        console.log('mensaje: ', res.errorMensaje);
        this.inscripcionCurso.mensaje = res.errorMensaje;
        mensajeConfirmacion('Excelente!', res.errorMensaje);
        this.dialogRef.close(this.inscripcionCurso);
      });
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
  /*
  
        cursoClasesPracticas
        cursoClasesTeoricas
        cursoExamenPractico
        cursoExamenTeorico
        */

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


  formatCI(value: string, digitoVerificador?: string): string {


    const ci = value;
    const cant: any = Math.ceil(ci.length / 3);

    let cadena = new Array(cant);
    let substring = ci;
    let corte;
    let result = '';

    for (let i = 0; i < cant; i++) {


      corte = (substring.length - 3);
      cadena[i] = substring.substring(corte, substring.length);
      substring = substring.substring(corte, 0);


    }

    cadena = cadena.reverse();

    for (let i = 0; i < cadena.length; i++) {
      if (i + 1 < cadena.length) {
        result += cadena[i] + '.';
      } else {
        result += cadena[i] + '-';
      }
    }
    console.log('result: ', result);

    return result + digitoVerificador;
  }

  generateSedes() {
    const sede1 = {
      id: 1,
      value: 'CYY',
      description: 'Colonia y Yi'
    };
    this.sedes.push(sede1);

    const sede2 = {
      id: 2,
      value: 'AV.It',
      description: 'Avenida Italia'
    };
    this.sedes.push(sede2);



    console.log('sedes: ', this.sedes);
  }

  generateHorasLibres() {
    for (let i = 6; i < 21; i++) {
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

    console.log('horas libres: ', this.horasLibres);
  }


  confirmacionUsuario(title, text) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });
  }

}
