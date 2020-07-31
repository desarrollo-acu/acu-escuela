import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestionInscripcionComponent } from '../gestion-inscripcion/gestion-inscripcion.component';
import { Inscripcion } from '../../../core/model/inscripcion.model';
import { formatCI } from '../../../utils/utils-functions';
import { AcuService } from '../../../core/services/acu.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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

  private subscription: Subscription;
  primeraVez = false;

  constructor(
    private acuService: AcuService,
    private formBuilder: FormBuilder,
    private router: Router) {

    this.generateHorasLibres();
    this.generateSedes();
    this.buildForm();
    this.deshabilitarCampos();
  }

  ngOnInit(): void {

    if (!this.primeraVez) {

      this.subscription = this.acuService.inscripcionCurrentData.subscribe((data) => {
        console.log('abm data: ', data);
        this.primeraVez = true;



        this.setValuesForm(data.inscripcion);

      }); /// .currentMessage.subscribe(message => this.message = message)
    }
  }

  private setValuesForm(inscripcion: Inscripcion) {
    this.inscripcion = inscripcion;
    const disponibilidadLunes: string[] = [];
    const disponibilidadMartes: string[] = [];
    const disponibilidadMiercoles: string[] = [];
    const disponibilidadJueves: string[] = [];
    const disponibilidadViernes: string[] = [];
    const disponibilidadSabado: string[] = [];
    console.log('this.inscripcion.DisponibilidadAlumno> ', this.inscripcion.DisponibilidadAlumno);

    this.inscripcion.DisponibilidadAlumno.forEach(item => {
      console.log('  item> ', item);
      switch (item.AluAgeDia) {
        case 'LUN':
          disponibilidadLunes.push(`${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`);
          break;
        case 'MAR':
          disponibilidadMartes.push(`${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`);
          break;
        case 'MIÉ':
          disponibilidadMiercoles.push(`${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`);
          break;
        case 'JUE':
          disponibilidadJueves.push(`${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`);
          break;
        case 'VIE':
          disponibilidadViernes.push(`${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`);
          break;
        case 'SÁB':
          disponibilidadSabado.push(`${item.AluAgeHoraInicio}-${item.AluAgeHoraFin}`);
          break;

      }

    });

    console.log('  disponibilidadLunes> ', disponibilidadLunes);
    console.log('  disponibilidadMartes> ', disponibilidadMartes);
    console.log('  disponibilidadMiercoles> ', disponibilidadMiercoles);
    console.log('  disponibilidadJueves', disponibilidadJueves);
    console.log('  disponibilidadViernes> ', disponibilidadViernes);

    this.fechaClase.setValue(this.fechaClase);
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
  generateSedes() {
    const sede1 = {
      id: 1,
      value: 'Colonia y Yi',
      description: 'Colonia y Yi'
    };
    this.sedes.push(sede1);

    const sede2 = {
      id: 2,
      value: 'BASE-CARRASCO',
      description: 'BASE CARRASCO'
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

  onNoClick(): void {
    // Me voy a la pantalla de gestión y elimino del Servicio
    this.router.navigate(['/escuela/gestion-inscripcion']);
  }



  private buildForm() {

    this.form = this.formBuilder.group({
      fechaClase: [''],
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
