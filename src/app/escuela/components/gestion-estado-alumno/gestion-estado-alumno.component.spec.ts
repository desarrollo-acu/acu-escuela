import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEstadoAlumnoComponent } from './gestion-estado-alumno.component';

describe('GestionEstadoAlumnoComponent', () => {
  let component: GestionEstadoAlumnoComponent;
  let fixture: ComponentFixture<GestionEstadoAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionEstadoAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEstadoAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
