import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloquearHorasComponent } from './bloquear-horas.component';

describe('BloquearHorasComponent', () => {
  let component: BloquearHorasComponent;
  let fixture: ComponentFixture<BloquearHorasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloquearHorasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloquearHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
