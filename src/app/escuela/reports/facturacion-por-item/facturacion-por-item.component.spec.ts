import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionPorItemComponent } from './facturacion-por-item.component';

describe('FacturacionPorItemComponent', () => {
  let component: FacturacionPorItemComponent;
  let fixture: ComponentFixture<FacturacionPorItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturacionPorItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionPorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
