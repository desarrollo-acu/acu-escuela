import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaRutComponent } from './factura-rut.component';

describe('FacturaRutComponent', () => {
  let component: FacturaRutComponent;
  let fixture: ComponentFixture<FacturaRutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturaRutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaRutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
