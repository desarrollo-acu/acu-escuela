import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarCustomComponent } from './seleccionar-custom.component';

describe('SeleccionarCustomComponent', () => {
  let component: SeleccionarCustomComponent;
  let fixture: ComponentFixture<SeleccionarCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
