import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenMedicoComponent } from './examen-medico.component';

describe('ExamenMedicoComponent', () => {
  let component: ExamenMedicoComponent;
  let fixture: ComponentFixture<ExamenMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamenMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
