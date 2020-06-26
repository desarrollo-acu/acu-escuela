import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedirCantidadClasesComponent } from './pedir-cantidad-clases.component';

describe('PedirCantidadClasesComponent', () => {
  let component: PedirCantidadClasesComponent;
  let fixture: ComponentFixture<PedirCantidadClasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedirCantidadClasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedirCantidadClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
