import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorHorasLibresComponent } from './instructor-horas-libres.component';

describe('InstructorHorasLibresComponent', () => {
  let component: InstructorHorasLibresComponent;
  let fixture: ComponentFixture<InstructorHorasLibresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorHorasLibresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorHorasLibresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
