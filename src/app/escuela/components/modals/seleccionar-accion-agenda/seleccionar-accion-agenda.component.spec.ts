import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarAccionAgendaComponent } from './seleccionar-accion-agenda.component';

describe('SeleccionarAccionAgendaComponent', () => {
  let component: SeleccionarAccionAgendaComponent;
  let fixture: ComponentFixture<SeleccionarAccionAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarAccionAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarAccionAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
