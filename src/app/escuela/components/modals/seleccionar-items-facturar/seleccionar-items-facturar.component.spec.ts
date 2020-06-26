import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarItemsFacturarComponent } from './seleccionar-items-facturar.component';

describe('SeleccionarItemsFacturarComponent', () => {
  let component: SeleccionarItemsFacturarComponent;
  let fixture: ComponentFixture<SeleccionarItemsFacturarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarItemsFacturarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarItemsFacturarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
