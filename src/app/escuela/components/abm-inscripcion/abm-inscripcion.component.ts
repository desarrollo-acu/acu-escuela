import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestionInscripcionComponent } from '../gestion-inscripcion/gestion-inscripcion.component';
import { Inscripcion } from '@core/model/inscripcion.model';
import { formatCI } from '@utils/utils-functions';
import { InscripcionService } from '@core/services/inscripcion.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { mensajeConfirmacion } from '@utils/sweet-alert';
import { confirmacionUsuario } from '../../../utils/sweet-alert';
import { generateHorasLibres, getDisponibilidadFromInscripcion, generateSedes } from '../../../utils/utils-functions';

@Component({
  selector: 'app-abm-inscripcion',
  templateUrl: './abm-inscripcion.component.html',
  styleUrls: ['./abm-inscripcion.component.scss']
})
export class AbmInscripcionComponent implements OnInit {


  form: FormGroup;
  inscripcion: Inscripcion;

  horasLibres = [];
  sedes = [];
  mode: string;

  private subscription: Subscription;
  primeraVez = false;

  constructor(
    private inscripcionService: InscripcionService,
    private formBuilder: FormBuilder,
    private router: Router) {

    this.horasLibres = generateHorasLibres();
    this.sedes = [ ...generateSedes() ];
    this.buildForm();
    this.deshabilitarCampos();
  }

  ngOnInit(): void {

    if (!this.primeraVez) {

      this.subscription = this.inscripcionService.inscripcionCurrentData.subscribe(({ modo, inscripcion }) => {

        this.primeraVez = true;

        this.mode = modo;

        this.setValuesForm(inscripcion);

      }); /// .currentMessage.subscribe(message => this.message = message)
    }
  }

  private setValuesForm(inscripcion: Inscripcion) {

    this.inscripcion = inscripcion;

    const {
      disponibilidadLunes,
      disponibilidadMartes,
      disponibilidadMiercoles,
      disponibilidadJueves,
      disponibilidadViernes,
      disponibilidadSabado,
    } = getDisponibilidadFromInscripcion( inscripcion );


    this.fechaClase.setValue(this.fechaClase);
    this.inscripcionId.setValue(this.inscripcion.EscAluCurId);
    this.cursoId.setValue(this.inscripcion.TipCurId);
    this.cursoNombre.setValue(this.inscripcion.TipCurNom);
    this.cursoClasesPracticas.setValue(this.inscripcion.TipCurClaPra);
    this.cursoClasesTeoricas.setValue(this.inscripcion.TipCurClaTeo);
    this.cursoExamenPractico.setValue(this.inscripcion.TipCurExaPra);
    this.cursoExamenTeorico.setValue(this.inscripcion.TipCurExaTeo);
    this.fechaInicioEstimada.setValue(this.inscripcion.EscAluFechaInicioEstimada);
    this.escCurTe1.setValue(this.inscripcion.ESCCURTE1);
    this.escCurTe2.setValue(this.inscripcion.ESCCURTE2);
    this.escCurTe3.setValue(this.inscripcion.ESCCURTE3);
    this.escCurIni.setValue(this.inscripcion.EscCurIni);
    this.alumnoNumero.setValue(this.inscripcion.AluNro);
    this.alumnoNombre.setValue(this.inscripcion.AluNomComp);
    this.alumnoCI.setValue(formatCI(this.inscripcion.AluCI.toString(), this.inscripcion.AluDV.toString()));
    this.alumnoTelefono.setValue(this.inscripcion.ALUTEL1);
    this.alumnoCelular.setValue(this.inscripcion.ALUTEL2);
    this.sede.setValue(this.inscripcion.EscAluCurSede);
    this.irABuscarAlAlumno.setValue(this.inscripcion.EscAluCurRecogerEnDomicilio);
    this.reglamentoEscuela.setValue(this.inscripcion.EscAluCurReglamentoEscuela);
    this.condicionesCurso.setValue(this.inscripcion.EscAluCurCondicionesCurso);
    this.eLearning.setValue(this.inscripcion.EscAluCurELearning);
    this.disponibilidadLunes.setValue(disponibilidadLunes);
    this.disponibilidadMartes.setValue(disponibilidadMartes);
    this.disponibilidadMiercoles.setValue(disponibilidadMiercoles);
    this.disponibilidadJueves.setValue(disponibilidadJueves);
    this.disponibilidadViernes.setValue(disponibilidadViernes);
    this.disponibilidadSabado.setValue(disponibilidadSabado);
    this.observaciones.setValue(this.inscripcion.EscAluCurObs);


  }


  onNoClick(): void {
    // Me voy a la pantalla de gestión y elimino del Servicio
    this.router.navigate(['/escuela/gestion-inscripcion']);
  }



  private buildForm() {

    this.form = this.formBuilder.group({
      fechaClase: [''],
      inscripcionId: [''],
      cursoId: [''],
      cursoNombre: [''],
      cursoClasesPracticas: [''],
      cursoClasesTeoricas: [''],
      cursoExamenPractico: [''],
      cursoExamenTeorico: [''],
      fechaInicioEstimada: [''],
      escCurTe1: [''],
      escCurTe2: [''],
      escCurTe3: [''],
      escCurIni: [''],
      alumnoNumero: [''],
      alumnoNombre: [''],
      alumnoCI: [''],
      alumnoTelefono: [''],
      alumnoCelular: [''],
      sede: [''],
      irABuscarAlAlumno: [''],

      reglamentoEscuela: [''],
      condicionesCurso: [''],
      eLearning: [''],

      disponibilidadLunes: [''],
      disponibilidadMartes: [''],
      disponibilidadMiercoles: [''],
      disponibilidadJueves: [''],
      disponibilidadViernes: [''],
      disponibilidadSabado: [''],
      observaciones: ['']
    });

  }

  deshabilitarCampos() {
    // Deshabilitar fecha de inscripicón
    this.fechaClase.disable();


    // Campos deshabilitados del curso

    this.inscripcionId.disable();
    this.cursoId.disable();
    this.cursoNombre.disable();
    this.cursoClasesPracticas.disable();
    this.cursoClasesTeoricas.disable();
    this.cursoExamenPractico.disable();
    this.cursoExamenTeorico.disable();
    this.fechaInicioEstimada.disable();
    this.escCurTe1.disable();
    this.escCurTe2.disable();
    this.escCurTe3.disable();
    this.escCurIni.disable();

    // Campos deshabilitados del alumno
    this.alumnoNumero.disable();
    this.alumnoCI.disable();
    this.alumnoTelefono.disable();
    this.alumnoNombre.disable();
    this.alumnoCelular.disable();

    this.sede.disable();
    this.irABuscarAlAlumno.disable();

    this.reglamentoEscuela.disable();
    this.condicionesCurso.disable();
    this.eLearning.disable();


    this.observaciones.disable();




  }
  guardarDisponibilidad = (e: Event) =>{
    e.preventDefault();


    const inscripcion = {
      AluId: this.inscripcion.AluId,
      TipCurId: this.cursoId.value,
      EscAluCurId: this.inscripcion.EscAluCurId,
      disponibilidadLunes: this.disponibilidadLunes.value,
      disponibilidadMartes: this.disponibilidadMartes.value,
      disponibilidadMiercoles: this.disponibilidadMiercoles.value,
      disponibilidadJueves: this.disponibilidadJueves.value,
      disponibilidadViernes: this.disponibilidadViernes.value,
      disponibilidadSabado: this.disponibilidadSabado.value,
      usrId: localStorage.getItem('usrId')


    }


    this.inscripcionService.guardarNuevaDisponibilidad( inscripcion ).subscribe( ({ errorMensaje }) => {
      mensajeConfirmacion('Excelente!', errorMensaje).then( () => this.router.navigate(['/escuela/gestion-inscripcion']) );

    } );


  }

  limpiarDisponibilidades = () => {

    confirmacionUsuario('Confirmación de usuario','Está seguro que desea limpiar todas las disponibilidades?')
      .then( ({isConfirmed}) => {
        if( isConfirmed ){
          this.disponibilidadLunes.setValue([]);
          this.disponibilidadMartes.setValue([]);
          this.disponibilidadMiercoles.setValue([]);
          this.disponibilidadJueves.setValue([]);
          this.disponibilidadViernes.setValue([]);
          this.disponibilidadSabado.setValue([]);

        }
      })


  }
  get observaciones() {
    return this.form.get('observaciones');
  }

  get fechaClase() {
    return this.form.get('fechaClase');
  }

  get sede() {
    return this.form.get('sede');
  }
  get fechaInicioEstimada() {
    return this.form.get('fechaInicioEstimada');
  }

  get irABuscarAlAlumno() {
    return this.form.get('irABuscarAlAlumno');
  }
  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }

  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }

  get alumnoCI() {
    return this.form.get('alumnoCI');
  }

  get alumnoTelefono() {
    return this.form.get('alumnoTelefono');
  }

  get alumnoCelular() {
    return this.form.get('alumnoCelular');
  }

  get inscripcionId() {
    return this.form.get('inscripcionId');
  }

  get cursoId() {
    return this.form.get('cursoId');
  }
  get cursoNombre() {
    return this.form.get('cursoNombre');
  }
  get cursoClasesPracticas() {
    return this.form.get('cursoClasesPracticas');
  }
  get cursoClasesTeoricas() {
    return this.form.get('cursoClasesTeoricas');
  }

  get cursoExamenPractico() {
    return this.form.get('cursoExamenPractico');
  }


  get documentosEntregadosYFirmados() {
    return this.form.get('documentosEntregadosYFirmados');
  }

  get reglamentoEscuela() {
    return this.form.get('reglamentoEscuela');
  }

  get condicionesCurso() {
    return this.form.get('condicionesCurso');
  }

  get eLearning() {
    return this.form.get('eLearning');
  }

  get cursoExamenTeorico() {
    return this.form.get('cursoExamenTeorico');
  }


  get escCurTe1() {
    return this.form.get('escCurTe1');
  }



  get escCurTe2() {
    return this.form.get('escCurTe2');
  }
  get escCurTe3() {
    return this.form.get('escCurTe3');
  }
  get escCurIni() {
    return this.form.get('escCurIni');
  }

  get disponibilidadLunes() {
    return this.form.get('disponibilidadLunes');
  }

  get disponibilidadMartes() {
    return this.form.get('disponibilidadMartes');
  }

  get disponibilidadMiercoles() {
    return this.form.get('disponibilidadMiercoles');
  }

  get disponibilidadJueves() {
    return this.form.get('disponibilidadJueves');
  }

  get disponibilidadViernes() {
    return this.form.get('disponibilidadViernes');
  }

  get disponibilidadSabado() {
    return this.form.get('disponibilidadSabado');
  }



}
