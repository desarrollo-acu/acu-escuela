import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AcuService } from '@core/services/acu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Curso, CursoItem } from '@core/model/curso.model';
import { mensajeConfirmacion } from '@utils/sweet-alert';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-curso',
  templateUrl: './abm-curso.component.html',
  styleUrls: ['./abm-curso.component.scss']
})

export class AbmCursoComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  cursoForm: FormGroup;

  items: CursoItem[] = [];
  displayedColumns: string[] = ['actions-abm', 'EscItemCod', 'EscItemDesc', 'EscCurItemCur', 'EscCurIteClaAdi', 'confirmar-cancelar'];

  mode: string;
  primeraVez = false;
  titulo: string;

  constructor(
    private acuService: AcuService,
    private fb: FormBuilder,
    private router: Router) {

    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.primeraVez) {

      this.subscription = this.acuService.cursoCurrentData.subscribe((data) => {
        console.log('abm data: ', data);
        this.primeraVez = true;
        this.mode = data.modo;

        this.changeForm(data.modo, data.curso);

      }); /// .currentMessage.subscribe(message => this.message = message)
    }
  }


  onNoClick(): void {
    // Me voy a la pantalla de gestión y elimino del Servicio
    this.router.navigate(['/escuela/gestion-curso']);
  }


  private buildForm() {

    this.cursoForm = this.fb.group({
      tipCurId: ['', Validators.required],
      tipCurNom: ['', Validators.required],
      tipCurClaPra: ['', Validators.required],
      tipCurClaTeo: ['', Validators.required],
      tipCurExaPra: ['', Validators.required],
      tipCurExaTeo: ['', Validators.required],
      tipCurSoc: ['', Validators.required],
      tipCurEst: ['', Validators.required],
      tipCuItemIdValCur: ['', Validators.required],
      tipCuItemDescValCur: [''],
    });

    this.tipCuItemDescValCur.disable();

  }


  private changeForm(modo: string, curso: Curso) {


    if (modo === 'INS') {
      this.titulo = 'Agregar';
      // this.aluId = 0;
      // console.log('aluNumero: ', aluNumero);
      // this.aluNroField.setValue(aluNumero);
      // console.log('this.aluNroField.value: ', this.aluNroField.value);

    } else {


      this.titulo = 'Editar';
      this.items = curso.Items;
      this.setValuesForm(curso);


    }

  }


  guardarCurso(event: Event) {
    event.preventDefault();

    console.log('Submit, form valid: ', this.cursoForm.valid);
    console.log('Submit, form value: ', this.cursoForm.value);

    if (this.cursoForm.valid) {
      console.log('cursoForm.value: ', this.cursoForm.value);

      const curso: Curso = {
        TipCurId: this.tipCurId.value,
        TipCurNom: this.tipCurNom.value,
        TipCurClaPra: this.tipCurClaPra.value,
        TipCurClaTeo: this.tipCurClaTeo.value,
        TipCurEst: this.tipCurEst.value,
        TipCurExaPra: this.tipCurExaPra.value,
        TipCurExaTeo: this.tipCurExaTeo.value,
        TipCurSoc: this.tipCurSoc.value,
        TipCuItemIdValCur: this.tipCuItemIdValCur.value,
        TipCuItemDescValCur: this.tipCuItemDescValCur.value,
        Items: this.items,
      };

      console.log('curso: ', curso);
      const log = JSON.stringify(curso);
      console.log('curso og: ', log);
      this.acuService.gestionCurso(this.mode, curso) // guardarAgendaInstructor(this.inscripcionCurso)
        .subscribe((res: any) => {
          console.log('res: ', res);

          if (res.Curso.ErrorCode === 0) {
            mensajeConfirmacion('Confirmado!', res.Curso.ErrorMessage).then((res2) => {

              this.router.navigate(['/escuela/gestion-curso']);

            });


          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: res.Curso.ErrorMessage
            });
          }

        });


    }
  }


  private setValuesForm(curso: Curso) {


    this.tipCurId.setValue(curso.TipCurId);
    this.tipCurNom.setValue(curso.TipCurNom);
    this.tipCurClaPra.setValue(curso.TipCurClaPra);
    this.tipCurClaTeo.setValue(curso.TipCurClaTeo);
    this.tipCurExaPra.setValue(curso.TipCurExaPra);
    this.tipCurExaTeo.setValue(curso.TipCurExaTeo);
    this.tipCurSoc.setValue(curso.TipCurSoc);
    this.tipCurEst.setValue(curso.TipCurEst);
    this.tipCuItemIdValCur.setValue(curso.TipCuItemIdValCur);
    this.tipCuItemDescValCur.setValue(curso.TipCuItemDescValCur);


  }



  get tipCurId() {
    return this.cursoForm.get('tipCurId');
  }

  get tipCurNom() {
    return this.cursoForm.get('tipCurNom');
  }

  get tipCurClaPra() {
    return this.cursoForm.get('tipCurClaPra');
  }

  get tipCurClaTeo() {
    return this.cursoForm.get('tipCurClaTeo');
  }

  get tipCurExaPra() {
    return this.cursoForm.get('tipCurExaPra');
  }

  get tipCurExaTeo() {
    return this.cursoForm.get('tipCurExaTeo');
  }

  get tipCurSoc() {
    return this.cursoForm.get('tipCurSoc');
  }

  get tipCurEst() {
    return this.cursoForm.get('tipCurEst');
  }

  get tipCuItemIdValCur() {
    return this.cursoForm.get('tipCuItemIdValCur');
  }

  get tipCuItemDescValCur() {
    return this.cursoForm.get('tipCuItemDescValCur');
  }


}
