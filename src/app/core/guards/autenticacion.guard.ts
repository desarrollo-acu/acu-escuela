import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';
import { AutenticacionResponse } from '../model/autenticacion-response.model';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionGuard implements CanActivate, CanActivateChild {
  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router
  ) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const usrId = localStorage.getItem('usrId');

    const estaLogeado = !(usrId === null || usrId === undefined || usrId === '');

    if (!estaLogeado) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
    return estaLogeado;
  }
}
