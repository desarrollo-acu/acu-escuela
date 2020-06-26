import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesEstimadasDetalleComponent } from './clases-estimadas-detalle.component';

describe('ClasesEstimadasDetalleComponent', () => {
  let component: ClasesEstimadasDetalleComponent;
  let fixture: ComponentFixture<ClasesEstimadasDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasesEstimadasDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasesEstimadasDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
