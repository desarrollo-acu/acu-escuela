import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgendaMovilComponent } from '../../agenda-movil/agenda-movil.component';

import { MyValidators } from '@utils/validators';
import { ResponseFacturaRUT } from '@core/model/responseFacturaRUT.model';
import {
  RequiredAfterFieldNoChecked,
  RequiredAfterFieldChecked,
} from '@utils/custom-validator';
import { confirmacionUsuario } from '@utils/sweet-alert';

@Component({
  selector: 'app-factura-rut',
  templateUrl: './factura-rut.component.html',
  styleUrls: ['./factura-rut.component.scss'],
})
export class FacturaRutComponent implements OnInit {
  form: FormGroup;
  facturaCheck = true;
  facturaConRUTCheck = false;
  formInvalid = false;

  noFacMotInvalid = false;
  facturaResponse: ResponseFacturaRUT;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AgendaMovilComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.facturaResponse = {
      generaFactura: this.facturaCheck,
      motivoNoFactura: '',
      facturaConRUT: this.facturaConRUTCheck,
      RUT: '',
      razonSocial: '',
      descuento: 0,
    };

    this.buildForm();
    this.actualizarFormInvalid();
  }

  ngOnInit() {}

  facturar(event: Event) {
    event.preventDefault();
    this.actualizarFormInvalid();

    if (this.formInvalid) {
      return;
    }

    this.dialogRef.close({
      continuar: true,
      factura: this.facturaResponse,
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        factura: [this.facturaCheck],
        noFacMot: [''],
        facturaConRUT: [this.facturaConRUTCheck],
        RUT: ['', [MyValidators.isRUTValid]],
        razonSocial: [''],
        descuentoCurso: [0, [MyValidators.isPorcentajeValid]],
      },
      {
        validator: [
          RequiredAfterFieldNoChecked('factura', 'noFacMot'),
          RequiredAfterFieldChecked('facturaConRUT', 'razonSocial'),
        ],
      }
    );
  }

  onSalir(): void {
    this.dialogRef.close({
      salir: true,
    });
  }

  onNoClick(): void {
    // confirmacionUsuario('Cancelar factura', 'Se cancelará el proceso de facturación. ¿Confirma continuar?').then(confirma => {

    //   if (confirma.isConfirmed) {
    this.dialogRef.close();
    //   }
    // });
  }

  actualizarFormInvalid() {
    this.formInvalid = false;
    this.noFacMotInvalid = false;

    if (this.noFacMotField.value === '' && !this.facturaCheck) {
      this.formInvalid = true;
      this.noFacMotInvalid = true;
    } else {
      if (this.facturaCheck && this.facturaConRUTCheck) {
        if (
          this.RUTField.value === '' ||
          this.razonSocialField.value === '' ||
          this.RUTField.hasError('rut_invalid')
        ) {
          this.formInvalid = true;
        }
      }

      if (!this.formInvalid) {
        if (this.descuentoCursoField.hasError('porcentaje_invalid')) {
          this.formInvalid = true;
        }
      }
    }
  }

  get facturaField() {
    return this.form.get('factura');
  }

  get noFacMotField() {
    return this.form.get('noFacMot');
  }

  get facturaConRUTField() {
    return this.form.get('facturaConRUT');
  }

  get RUTField() {
    return this.form.get('RUT');
  }

  get razonSocialField() {
    return this.form.get('razonSocial');
  }

  get descuentoCursoField() {
    return this.form.get('descuentoCurso');
  }
}
