import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmExamenComponent } from './abm-examen.component';

describe('AbmExamenComponent', () => {
  let component: AbmExamenComponent;
  let fixture: ComponentFixture<AbmExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
