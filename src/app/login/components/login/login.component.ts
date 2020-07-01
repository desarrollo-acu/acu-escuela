import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AcuService } from '@core/services/acu.service';
import { LoginResponse } from '@core/model/login.model';
import { mensajeConfirmacion, errorMensaje } from '@utils/sweet-alert';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showSppiner = false;
  constructor(
    private acuService: AcuService,
    private router: Router,
    private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  ngOnInit(): void {
  }

  login() {

    this.showSppiner = true;
    this.acuService.iniciarSesion(this.userField.value, this.passwordField.value).subscribe((res: LoginResponse) => {
      console.log('res: ', res);
      console.log('res.LoginOk: ', res.Login.LoginOk);
      console.log('res.Mensaje: ', res.Login.Mensaje);

      this.showSppiner = false;
      if (res.Login.LoginOk) {
        mensajeConfirmacion('Excelente!', res.Login.Mensaje);

        this.router.navigate(['/escuela/agenda-movil']);

      } else {
        errorMensaje('Ocurrió un problema', res.Login.Mensaje);
      }



    });
  }


  get userField() {
    return this.loginForm.get('user');
  }

  get passwordField() {
    return this.loginForm.get('password');
  }

}
