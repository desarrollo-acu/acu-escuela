import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarInstructorComponent } from './seleccionar-instructor.component';

describe('SeleccionarInstructorComponent', () => {
  let component: SeleccionarInstructorComponent;
  let fixture: ComponentFixture<SeleccionarInstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarInstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
