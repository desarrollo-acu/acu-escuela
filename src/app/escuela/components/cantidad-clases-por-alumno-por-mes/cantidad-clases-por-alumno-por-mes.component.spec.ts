import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadClasesPorAlumnoPorMesComponent } from './cantidad-clases-por-alumno-por-mes.component';

describe('CantidadClasesPorAlumnoPorMesComponent', () => {
  let component: CantidadClasesPorAlumnoPorMesComponent;
  let fixture: ComponentFixture<CantidadClasesPorAlumnoPorMesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantidadClasesPorAlumnoPorMesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantidadClasesPorAlumnoPorMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
