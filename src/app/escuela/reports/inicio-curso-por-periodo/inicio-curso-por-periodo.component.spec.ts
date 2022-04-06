import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioCursoPorPeriodoComponent } from './inicio-curso-por-periodo.component';

describe('InicioCursoPorPeriodoComponent', () => {
  let component: InicioCursoPorPeriodoComponent;
  let fixture: ComponentFixture<InicioCursoPorPeriodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioCursoPorPeriodoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioCursoPorPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
