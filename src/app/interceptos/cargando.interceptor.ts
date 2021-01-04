import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class CargandoInterceptor implements HttpInterceptor {


  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private router: Router,
    // private blockUI: BlockUIService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // this.blockUI.start(BLOCKUI_DEFAULT);
    this.blockUI.start();
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {


        this.blockUI.stop();
        if (event instanceof HttpResponse) {
          console.log('event:: ', event);

        }
        return event;
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(err);
      })
    );
  }
}
