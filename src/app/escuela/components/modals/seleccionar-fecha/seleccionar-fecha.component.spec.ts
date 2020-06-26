import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarFechaComponent } from './seleccionar-fecha.component';

describe('SeleccionarFechaComponent', () => {
  let component: SeleccionarFechaComponent;
  let fixture: ComponentFixture<SeleccionarFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
