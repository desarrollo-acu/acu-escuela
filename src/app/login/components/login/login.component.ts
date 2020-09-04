import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginResponse } from '@core/model/login.model';
import { mensajeConfirmacion, errorMensaje } from '@utils/sweet-alert';
import { Router } from '@angular/router';
import { AutenticacionService } from '@core/services/autenticacion.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showSppiner = false;
  constructor(
    private autenticacionService: AutenticacionService,
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
    this.autenticacionService.iniciarSesion(this.userField.value, this.passwordField.value).subscribe((res: any) => {
      console.log('res: ', res);
      console.log('res.LoginOk: ', res.authResponse.LoginEscuela.LoginOk);
      console.log('res.Mensaje: ', res.authResponse.LoginEscuela.Mensaje);

      this.showSppiner = false;
      if (res.authResponse.LoginEscuela.LoginOk) {
        mensajeConfirmacion('Excelente!', res.authResponse.LoginEscuela.Mensaje);
        localStorage.setItem('usrId', this.userField.value);
        localStorage.setItem('infoUsuario', JSON.stringify(res.authResponse));

        this.router.navigate(['/escuela/agenda-movil']);

      } else {
        errorMensaje('Ocurrió un problema', res.authResponse.LoginEscuela.Mensaje);
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
