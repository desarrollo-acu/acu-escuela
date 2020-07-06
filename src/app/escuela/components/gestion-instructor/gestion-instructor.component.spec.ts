import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInstructorComponent } from './gestion-instructor.component';

describe('GestionInstructorComponent', () => {
  let component: GestionInstructorComponent;
  let fixture: ComponentFixture<GestionInstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionInstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
