import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarMovilComponent } from './seleccionar-movil.component';

describe('SeleccionarMovilComponent', () => {
  let component: SeleccionarMovilComponent;
  let fixture: ComponentFixture<SeleccionarMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
