import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarClaveAccionesComponent } from './ingresar-clave-acciones.component';

describe('IngresarClaveAccionesComponent', () => {
  let component: IngresarClaveAccionesComponent;
  let fixture: ComponentFixture<IngresarClaveAccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresarClaveAccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarClaveAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
