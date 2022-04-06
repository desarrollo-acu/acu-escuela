import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasPorAlumnoComponent } from './facturas-por-alumno.component';

describe('FacturasPorAlumnoComponent', () => {
  let component: FacturasPorAlumnoComponent;
  let fixture: ComponentFixture<FacturasPorAlumnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturasPorAlumnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasPorAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
