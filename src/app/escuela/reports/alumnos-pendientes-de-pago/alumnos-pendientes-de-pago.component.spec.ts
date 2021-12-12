import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosPendientesDePagoComponent } from './alumnos-pendientes-de-pago.component';

describe('AlumnosPendientesDePagoComponent', () => {
  let component: AlumnosPendientesDePagoComponent;
  let fixture: ComponentFixture<AlumnosPendientesDePagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnosPendientesDePagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnosPendientesDePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
