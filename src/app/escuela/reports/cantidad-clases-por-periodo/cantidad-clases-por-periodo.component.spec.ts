import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadClasesPorPeriodoComponent } from './cantidad-clases-por-periodo.component';

describe('CantidadClasesPorPeriodoComponent', () => {
  let component: CantidadClasesPorPeriodoComponent;
  let fixture: ComponentFixture<CantidadClasesPorPeriodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantidadClasesPorPeriodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantidadClasesPorPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
