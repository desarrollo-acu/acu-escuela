import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from '@core/services/autenticacion.service';
import { AgendaMovilComponent } from '../../components/agenda-movil/agenda-movil.component';
import { AgendaInstructorComponent } from '../../components/agenda-instructor/agenda-instructor.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ingresar-clave-acciones',
  templateUrl: './ingresar-clave-acciones.component.html',
  styleUrls: ['./ingresar-clave-acciones.component.scss'],
})
export class IngresarClaveAccionesComponent implements OnInit {
  hide = true;
  form: FormGroup;

  get password() {
    return this.form.get('password');
  }

  constructor(
    private autenticacionService: AutenticacionService,
    public dialogRef: MatDialogRef<
      AgendaMovilComponent | AgendaInstructorComponent
    >,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ingresarClave = () =>
    this.autenticacionService
      .verificarClaveAcciones(this.password.value)
      .subscribe( ({claveValida}) =>  this.dialogRef.close({claveValida}) );
}
