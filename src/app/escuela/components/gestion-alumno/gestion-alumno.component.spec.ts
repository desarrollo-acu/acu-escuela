import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAlumnoComponent } from './gestion-alumno.component';

describe('GestionAlumnoComponent', () => {
  let component: GestionAlumnoComponent;
  let fixture: ComponentFixture<GestionAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
