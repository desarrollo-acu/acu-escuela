import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarClaseComponent } from './agendar-clase.component';

describe('AgendarClaseComponent', () => {
  let component: AgendarClaseComponent;
  let fixture: ComponentFixture<AgendarClaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendarClaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendarClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
