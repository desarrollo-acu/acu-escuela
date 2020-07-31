import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilidadAlumnoComponent } from './disponibilidad-alumno.component';

describe('DisponibilidadAlumnoComponent', () => {
  let component: DisponibilidadAlumnoComponent;
  let fixture: ComponentFixture<DisponibilidadAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisponibilidadAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisponibilidadAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
