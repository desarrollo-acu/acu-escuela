import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarItemComponent } from './seleccionar-item.component';

describe('SeleccionarItemComponent', () => {
  let component: SeleccionarItemComponent;
  let fixture: ComponentFixture<SeleccionarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
