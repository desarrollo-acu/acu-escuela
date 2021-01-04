import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarClaseAdicionalComponent } from './generar-clase-adicional.component';

describe('GenerarClaseAdicionalComponent', () => {
  let component: GenerarClaseAdicionalComponent;
  let fixture: ComponentFixture<GenerarClaseAdicionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarClaseAdicionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarClaseAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
