import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmInstructorComponent } from './abm-instructor.component';

describe('AbmInstructorComponent', () => {
  let component: AbmInstructorComponent;
  let fixture: ComponentFixture<AbmInstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmInstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
