import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarAlumnoComponent } from './seleccionar-alumno.component';

describe('SeleccionarAlumnoComponent', () => {
  let component: SeleccionarAlumnoComponent;
  let fixture: ComponentFixture<SeleccionarAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
