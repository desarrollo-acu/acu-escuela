import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarItemCursoComponent } from './seleccionar-item-curso.component';

describe('SeleccionarItemCursoComponent', () => {
  let component: SeleccionarItemCursoComponent;
  let fixture: ComponentFixture<SeleccionarItemCursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarItemCursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarItemCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
