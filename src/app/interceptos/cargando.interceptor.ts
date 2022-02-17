import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { AutenticacionService } from '../core/services/autenticacion.service';
import { HttpStatusCode } from '../core/model/enum/http-status-code.enum';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CargandoInterceptor implements HttpInterceptor {

  statusCodes: HttpStatusCode[] = [
    HttpStatusCode.Ok,
    HttpStatusCode.Created,
    HttpStatusCode.NoContent,
  ];

  errorStatusCodes: HttpStatusCode[] = [
    HttpStatusCode.Unauthorized,
    HttpStatusCode.Forbidden,
  ];

  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private router: Router,
    private authService: AutenticacionService,
    private toast: MatSnackBar
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = request.clone({
      setHeaders: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    });
    this.blockUI.start();
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {

        if (event instanceof HttpResponse) {
          const { body } = event;

          if( !body?.authResponse?.LoginEscuela?.LoginOk && (this.authService.getUserId() === '' || !this.authService.getUserId())){
            this.authService.logout();
          }



        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        if (this.errorStatusCodes.includes(err.status)) {
          this.router.navigate(['/login']);
        }else {
          this.toast.open("Ocurrió un error", "Avisar a informatica");
        }

        console.log(err);

        return throwError(err);
      })
      ,finalize( () => this.blockUI.stop() )
    );
  }
}
