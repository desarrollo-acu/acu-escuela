import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesProximosVencerComponent } from './expedientes-proximos-vencer.component';

describe('ExpedientesProximosVencerComponent', () => {
  let component: ExpedientesProximosVencerComponent;
  let fixture: ComponentFixture<ExpedientesProximosVencerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpedientesProximosVencerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedientesProximosVencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
