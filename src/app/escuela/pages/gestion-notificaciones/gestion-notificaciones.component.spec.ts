import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNotificacionesComponent } from './gestion-notificaciones.component';

describe('GestionNotificacionesComponent', () => {
  let component: GestionNotificacionesComponent;
  let fixture: ComponentFixture<GestionNotificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionNotificacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
