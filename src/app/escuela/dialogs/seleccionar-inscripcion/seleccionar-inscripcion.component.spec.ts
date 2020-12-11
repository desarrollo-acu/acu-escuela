import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarInscripcionComponent } from './seleccionar-inscripcion.component';

describe('SeleccionarInscripcionComponent', () => {
  let component: SeleccionarInscripcionComponent;
  let fixture: ComponentFixture<SeleccionarInscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarInscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
