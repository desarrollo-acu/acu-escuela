import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionExamenComponent } from './gestion-examen.component';

describe('GestionExamenComponent', () => {
  let component: GestionExamenComponent;
  let fixture: ComponentFixture<GestionExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
