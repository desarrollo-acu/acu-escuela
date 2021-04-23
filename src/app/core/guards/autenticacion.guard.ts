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

    this.autenticacionService.estaLogueado(usrId).subscribe(({authResponse}: any) => {
      localStorage.setItem('infoUsuario', JSON.stringify(authResponse));
    });

    infoUsuario = JSON.parse(localStorage.getItem('infoUsuario'));

    if (!(infoUsuario.estaLogueado)) {
      this.router.navigate(['/login']);
    }
    return infoUsuario.estaLogueado;
  }

}
