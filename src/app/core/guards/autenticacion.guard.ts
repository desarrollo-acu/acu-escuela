import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';
import { AutenticacionResponse } from '../model/autenticacion-response.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionGuard implements CanActivate {

  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const usrId = localStorage.getItem('usrId');
    let infoUsuario: AutenticacionResponse = {};

    this.autenticacionService.estaLogueado(usrId).subscribe((res: any) => {
      const authResponse: AutenticacionResponse = res.authResponse;
      console.log('authResponse: : ', authResponse);
      console.log('authResponse: esta-loguedo: ', authResponse.estaLogueado);

      localStorage.setItem('infoUsuario', JSON.stringify(authResponse));
    });

    infoUsuario = JSON.parse(localStorage.getItem('infoUsuario'));
    console.log('guard-medico infoUsuario: ', infoUsuario);
    console.log('guard-medico infoUsuario.estaLogueado: ', infoUsuario.estaLogueado);
    if (!(infoUsuario.estaLogueado)) {
      this.router.navigate(['/login']);
    }
    return infoUsuario.estaLogueado;
  }

}
