import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspenderClaseComponent } from './suspender-clase.component';

describe('SuspenderClaseComponent', () => {
  let component: SuspenderClaseComponent;
  let fixture: ComponentFixture<SuspenderClaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspenderClaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspenderClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
