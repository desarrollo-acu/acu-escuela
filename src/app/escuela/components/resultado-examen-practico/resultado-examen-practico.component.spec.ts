import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoExamenPracticoComponent } from './resultado-examen-practico.component';

describe('ResultadoExamenPracticoComponent', () => {
  let component: ResultadoExamenPracticoComponent;
  let fixture: ComponentFixture<ResultadoExamenPracticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoExamenPracticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoExamenPracticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
