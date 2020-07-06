import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmAlumnoComponent } from './abm-alumno.component';

describe('AbmAlumnoComponent', () => {
  let component: AbmAlumnoComponent;
  let fixture: ComponentFixture<AbmAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
