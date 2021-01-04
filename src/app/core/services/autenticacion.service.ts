import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {


  constructor(private http: HttpClient) { }

  setUserId = (userId: string) => localStorage.setItem('usrId', userId);

  getUserId = () => localStorage.getItem('usrId');

  iniciarSesion(UsrId: string, Pass: string) {
    console.log('User: ', UsrId);
    console.log('Pass: ', Pass);

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



  cambiarContrasenia(usrId: string, usrNuevaPass: string) {

    return this.http.post(`${environment.url_ws}/wsAutenticacionUsuario`, {
      tipo: 'cambiar-contrasenia',
      usrId,
      usrPass: usrNuevaPass
    });


  }


}
