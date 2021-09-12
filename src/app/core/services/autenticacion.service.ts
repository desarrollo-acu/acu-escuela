import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
interface ValidarClaveAcciones {
  claveValida: boolean
}
@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {


  constructor(private http: HttpClient, private router: Router) { }

  setUserId = (userId: string) => localStorage.setItem('usrId', userId);

  getUserId = () => localStorage.getItem('usrId');

  iniciarSesion(UsrId: string, Pass: string) {

    return this.http.post(`${environment.url_ws}/wsAutenticacionUsuario`, {
      tipo: 'inicio-escuela',
      usrId: UsrId,
      usrPass: Pass,
    });

  }

  estaLogueado(usrId: string) {

    return this.http.post(`${environment.url_ws}/wsAutenticacionUsuario`, {
      tipo: 'esta-logueado',
      usrId
    });

  }


  logout = () => this.router.navigate(['/']).then( () => localStorage.clear());

  cambiarContrasenia(usrId: string, usrNuevaPass: string) {

    return this.http.post(`${environment.url_ws}/wsAutenticacionUsuario`, {
      tipo: 'cambiar-contrasenia',
      usrId,
      usrPass: usrNuevaPass
    });

  }

  verificarClaveAcciones = ( password: string ) => this.http.post<ValidarClaveAcciones>(`${environment.url_ws}/wsVerificarClaveAcciones`, { password })


}
