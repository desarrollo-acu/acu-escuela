import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarNuevoPlanClasesComponent } from './generar-nuevo-plan-clases.component';

describe('GenerarNuevoPlanClasesComponent', () => {
  let component: GenerarNuevoPlanClasesComponent;
  let fixture: ComponentFixture<GenerarNuevoPlanClasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarNuevoPlanClasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarNuevoPlanClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
