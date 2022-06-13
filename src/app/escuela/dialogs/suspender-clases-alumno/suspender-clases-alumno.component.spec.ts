import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspenderClasesAlumnoComponent } from './suspender-clases-alumno.component';

describe('SuspenderClasesAlumnoComponent', () => {
  let component: SuspenderClasesAlumnoComponent;
  let fixture: ComponentFixture<SuspenderClasesAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspenderClasesAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspenderClasesAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
