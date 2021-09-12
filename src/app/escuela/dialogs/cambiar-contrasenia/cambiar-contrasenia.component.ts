import { Component, OnInit } from '@angular/core';
import { MustMatch } from '../../../utils/custom-validator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AutenticacionService } from '@core/services/autenticacion.service';
import { mensajeConfirmacion, errorMensaje } from '../../../utils/sweet-alert';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.scss']
})
export class CambiarContraseniaComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  usrId = this.autenticacionService.getUserId()

  fromEmail = false;
  token = null;
  hide = true;
  hideConfirm = true;

  form: FormGroup;

  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group(
      {
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
      },
      {
        validators: [MustMatch('password', 'passwordConfirm')],
      }
    );
  }

  ngOnInit(): void {
  }


  changePassword = () => {
    this.autenticacionService
      .cambiarContrasenia( this.usrId, this.password.value)
      .subscribe((res: any) => {

        if (res.authResponse.LoginEscuela.LoginOk) {
          localStorage.setItem('infoUsuario', JSON.stringify(res.authResponse));
          mensajeConfirmacion(
            'Excelente!',
            res.authResponse.LoginEscuela.Mensaje
          ).then(() => this.router.navigate(['/escuela/agenda-instructor']));
        } else {
          errorMensaje(
            'Ocurrió un problema',
            res.authResponse.LoginEscuela.Mensaje
          );
        }
      });
  };
}
