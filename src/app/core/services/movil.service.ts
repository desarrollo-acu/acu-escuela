import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Movil } from '../model/movil.model';

@Injectable({
  providedIn: 'root'
})
export class MovilService {


  // esto va al movilService
  private movilDataSource = new BehaviorSubject({ modo: 'INS', movil: {}, id: 0 });
  movilCurrentData = this.movilDataSource.asObservable();

  constructor(private http: HttpClient) { }

  gestionMovil(mode: string, movil: Movil) {
    return this.http.post(`${environment.url_ws}/wsGestionMovil`, {
      Movil: {
        Mode: mode,
        Movil: movil
      }
    });
  }

  getMoviles() {
    return this.http.get(`${environment.url_ws}/wsGetMoviles`);
  }

  sendDataMovil(modo: string, movil: Movil, id?: number) {

    const data: { modo: string, movil: Movil, id: number } = (id) ? { modo, movil, id } : { modo, movil, id: 0 };
    this.movilDataSource.next(data);

  }
}
