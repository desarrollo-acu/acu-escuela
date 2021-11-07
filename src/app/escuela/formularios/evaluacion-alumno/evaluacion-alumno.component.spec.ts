import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionAlumnoComponent } from './evaluacion-alumno.component';

describe('EvaluacionAlumnoComponent', () => {
  let component: EvaluacionAlumnoComponent;
  let fixture: ComponentFixture<EvaluacionAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
