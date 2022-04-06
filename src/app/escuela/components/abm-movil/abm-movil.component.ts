import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MovilService } from '@core/services/movil.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { mensajeConfirmacion } from '@utils/sweet-alert';
import Swal from 'sweetalert2';

import { Movil } from '@core/model/movil.model';


@Component({
  selector: 'app-abm-movil',
  templateUrl: './abm-movil.component.html',
  styleUrls: ['./abm-movil.component.scss']
})
export class AbmMovilComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  movilForm: FormGroup;


  mode: string;
  primeraVez = false;
  titulo: string;

  constructor(
    private movilService: MovilService,
    private fb: FormBuilder,
    private router: Router) {

    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    if (!this.primeraVez) {

      this.subscription = this.movilService.movilCurrentData.subscribe((data) => {

        this.primeraVez = true;
        this.mode = data.modo;



        this.changeForm(data.modo, data.movil);

      });
    }


  }


  onNoClick(): void {
    this.subscription.unsubscribe();
    // Me voy a la pantalla de gestión y elimino del Servicio
    this.router.navigate(['/escuela/gestion-movil']);
  }


  private buildForm() {

    this.movilForm = this.fb.group({
      movCod: ['', Validators.required],
      escMovId: ['', Validators.required],
      escVehEst: [''],
      escVehMot: [''],
      // escVehTpo: [''],
      escVehBajFch: [null],
      // EscVehOrdPan: [''],
    });

  }

  private changeForm(modo: string, movil: Movil) {

    if (modo === 'INS') {
      this.titulo = 'Agregar';
    } else {

      this.movCod.disable();
      this.escMovId.disable();
      this.titulo = 'Editar';
      this.setValuesForm(movil);
    }

  }

  guardarMovil(event: Event) {
    event.preventDefault();


    if (this.movilForm.valid) {

      const movil: Movil = {
        MovCod: this.movCod.value,
        EscMovId: this.escMovId.value,
        EscVehEst: this.escVehEst.value,
        EscVehMot: this.escVehMot.value,
        EscVehBajFch: this.escVehBajFch.value,
      };

      this.movilService.gestionMovil(this.mode, movil)
        .subscribe((res: any) => {

          if (res.Movil.ErrorCode === 0) {
            mensajeConfirmacion('Confirmado!', res.Movil.ErrorMessage).then((res2) => {

              this.router.navigate(['/escuela/gestion-movil']);

            });


          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: res.Movil.ErrorMessage
            });
          }

        });


    } else {
      return ;
    }
  }


  private setValuesForm(movil: Movil) {

    this.movCod.setValue(movil.MovCod);
    this.escMovId.setValue(movil.EscMovId);
    this.escVehEst.setValue(movil.EscVehEst);
    this.escVehMot.setValue(movil.EscVehMot);
    // this.escVehTpo.setValue(movil.EscVehTpo);
    const fecha = (movil.EscVehBajFch  && movil.EscVehBajFch !== '0000-00-00') ? movil.EscVehBajFch : null;


    this.escVehBajFch.setValue(fecha);
    // this.EscVehOrdPan.setValue(movil.EscVehOrdPan);


  }

  get movCod() {
    return this.movilForm.get('movCod');
  }

  get escMovId() {
    return this.movilForm.get('escMovId');
  }

  get escVehMot() {
    return this.movilForm.get('escVehMot');
  }

  get escVehEst() {
    return this.movilForm.get('escVehEst');
  }

  // get escVehTpo() {
  //   return this.movilForm.get('escVehTpo');
  // }

  get escVehBajFch() {
    return this.movilForm.get('escVehBajFch');
  }

  // get EscVehOrdPan() {
  //   return this.movilForm.get('EscVehOrdPan');
  // }


}
