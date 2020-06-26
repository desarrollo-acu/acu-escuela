import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaInstructorComponent } from './agenda-instructor.component';

describe('AgendaInstructorComponent', () => {
  let component: AgendaInstructorComponent;
  let fixture: ComponentFixture<AgendaInstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaInstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
