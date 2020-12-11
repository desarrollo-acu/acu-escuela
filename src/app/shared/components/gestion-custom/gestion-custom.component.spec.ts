import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCustomComponent } from './gestion-custom.component';

describe('GestionCustomComponent', () => {
  let component: GestionCustomComponent;
  let fixture: ComponentFixture<GestionCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
