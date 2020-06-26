import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgendaMovilComponent } from '../../agenda-movil/agenda-movil.component';
import { AcuService } from 'src/app/core/services/acu.service';
import { MyValidators } from 'src/app/utils/validators';
import { ResponseFacturaRUT } from 'src/app/core/model/responseFacturaRUT.model';
import { RequiredAfterFieldNoChecked, RequiredAfterFieldChecked } from 'src/app/utils/custom-validator';
import { confirmacionUsuario } from '@utils/sweet-alert';

@Component({
  selector: 'app-factura-rut',
  templateUrl: './factura-rut.component.html',
  styleUrls: ['./factura-rut.component.scss']
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
    private acuService: AcuService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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

  ngOnInit() {
  }

  facturar(event: Event) {
    event.preventDefault();
    console.log('Submit, form valid: ', this.form.valid);
    this.actualizarFormInvalid();
    console.log('Submit, formInvalid: ', this.formInvalid);

    if (this.formInvalid) {
      return;
    }



    console.log('Submit, facturaResponse: ', this.facturaResponse);

  }



  private buildForm() {

    this.form = this.formBuilder.group({
      factura: [this.facturaCheck],
      noFacMot: [''],
      facturaConRUT: [this.facturaConRUTCheck],
      RUT: ['', [MyValidators.isRUTValid]],
      razonSocial: [''],
      descuentoCurso: [0, [MyValidators.isPorcentajeValid]]
    }, {
      validator: [
        RequiredAfterFieldNoChecked('factura', 'noFacMot'),
        RequiredAfterFieldChecked('facturaConRUT', 'razonSocial'),
        // RequiredAfterFieldChecked('facturaConRUT', 'RUT'),
        // RequiredAfterFieldChecked('facturaConRUT', 'razonSocial'),
      ]
    });
  }


  onNoClick(): void {
    confirmacionUsuario('Cancelar factura', 'Se cancelará el proceso de facturación. ¿Confirma continuar?').then(confirma => {
      console.log('confirma: ', confirma);

      if (confirma.isConfirmed) {
        this.dialogRef.close();
      }
    });

  }

  actualizarFormInvalid() {
    console.log('actualizarFormInvalid');


    console.log(' this.noFacMotField.value: ', this.noFacMotField.value);

    this.formInvalid = false;
    this.noFacMotInvalid = false;

    if (this.noFacMotField.value === '' && !this.facturaCheck) {
      console.log(' 1)this.formInvalid ', this.formInvalid);
      this.formInvalid = true;
      this.noFacMotInvalid = true;
    } else {

      console.log(' 2.0)this.facturaCheck ', this.facturaCheck);
      console.log(' 2.1)this.facturaConRUTCheck ', this.facturaConRUTCheck);
      if (this.facturaCheck && this.facturaConRUTCheck) {
        console.log(' 2)this.formInvalid ', this.formInvalid);

        if (this.RUTField.value === '' || this.razonSocialField.value === '' || this.RUTField.hasError('rut_invalid')) {
          console.log(' 3)this.formInvalid ', this.formInvalid);
          this.formInvalid = true;
        }

        console.log(' 4)this.formInvalid ', this.formInvalid);

      }

      if (!this.formInvalid) {
        console.log(' 5)this.formInvalid ', this.formInvalid);
        if (this.descuentoCursoField.hasError('porcentaje_invalid')) {
          console.log(' 6)this.formInvalid ', this.formInvalid);
          this.formInvalid = true;
        }
      }
    }
    console.log(' 7)this.formInvalid ', this.formInvalid);
    console.log(' 8)this.noFacMotInvalid ', this.noFacMotInvalid);

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

