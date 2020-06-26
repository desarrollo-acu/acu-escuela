import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionCursoComponent } from './inscripcion-curso.component';

describe('InscripcionCursoComponent', () => {
  let component: InscripcionCursoComponent;
  let fixture: ComponentFixture<InscripcionCursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionCursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
