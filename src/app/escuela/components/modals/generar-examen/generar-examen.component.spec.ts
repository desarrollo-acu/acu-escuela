import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarExamenComponent } from './generar-examen.component';

describe('GenerarExamenComponent', () => {
  let component: GenerarExamenComponent;
  let fixture: ComponentFixture<GenerarExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
