import { Component, OnInit } from '@angular/core';
import { InscripcionService } from '@core/services/inscripcion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Examen } from '../../../core/model/examen.model';
import { MotivoReprobacionExamen } from '../../../core/model/motivo-reprobacion-examen.enum';

@Component({
  selector: 'app-abm-examen',
  templateUrl: './abm-examen.component.html',
  styleUrls: ['./abm-examen.component.scss']
})
export class AbmExamenComponent implements OnInit {
  form: FormGroup;

  primeraVez = false;
  modo: string;

  examen: Examen;
  motivosReprobacion = MotivoReprobacionExamen;
  motivos =   Object.keys(MotivoReprobacionExamen);


  get aluId() { return this.form.get('aluId'); }
  get alumno() { return this.form.get('alumno'); }
  get curso() { return this.form.get('curso'); }
  get escAluCurId() { return this.form.get('escAluCurId'); }
  get escAluCurExamenId() { return this.form.get('escAluCurExamenId'); }
  get escAluCurExamenFecha() { return this.form.get('escAluCurExamenFecha'); }
  get escAluCurExamenAprueba() { return this.form.get('escAluCurExamenAprueba'); }
  get escAluCurExamenObservaciones() { return this.form.get('escAluCurExamenObservaciones'); }
  get escAluCurExamenMotivoReprobacion() { return this.form.get('escAluCurExamenMotivoReprobacion'); }




  constructor(
    private inscripcionService: InscripcionService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {


    this.form = this.fb.group({
      aluId: [''],
      alumno: [''],
      curso: [''],
      escAluCurId: [''],
      escAluCurExamenId: [''],
      escAluCurExamenFecha: [''],
      escAluCurExamenAprueba: [''],
      escAluCurExamenObservaciones: [''],
      escAluCurExamenMotivoReprobacion: [''],
    });
     }

  ngOnInit(): void {


    this.route.queryParams.subscribe((param) => {
      console.log('param:: ', param);

      this.examen = {
        ALUID: param.AluId,
	      TIPCURID: param.TIPCURID,
        EscAluCurId: param.EscAluCurId,
        EscAluCurExamenId: param.EscAluCurExamenId,
      }
      this.modo = param.modo;


      if (param.EscAluCurExamenId) {
        this.inscripcionService.getExamenById(this.examen)
          .subscribe((examen) => this.setValuesOnForm(examen));
      }
    });
  }

  setValuesOnForm(examen: Examen){
    this.aluId.setValue(examen.ALUID);
    this.curso.setValue(examen.Curso);
    this.alumno.setValue(examen.Alumno);
    this.escAluCurId.setValue(examen.EscAluCurId);
    this.escAluCurExamenId.setValue(examen.EscAluCurExamenId);
    this.escAluCurExamenFecha.setValue(examen.EscAluCurExamenFecha);
    this.escAluCurExamenAprueba.setValue(examen.EscAluCurExamenAprueba);
    this.escAluCurExamenObservaciones.setValue(examen.EscAluCurExamenObservaciones);
    this.escAluCurExamenMotivoReprobacion.setValue(examen.EscAluCurExamenMotivoReprobacion);
  }


  onNoClick = () => this.location.back();

  guardarExamen = (event: Event) => {

  }



}
