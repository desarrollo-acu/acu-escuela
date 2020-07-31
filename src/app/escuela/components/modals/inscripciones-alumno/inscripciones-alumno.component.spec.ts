import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionesAlumnoComponent } from './inscripciones-alumno.component';

describe('InscripcionesAlumnoComponent', () => {
  let component: InscripcionesAlumnoComponent;
  let fixture: ComponentFixture<InscripcionesAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionesAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionesAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
