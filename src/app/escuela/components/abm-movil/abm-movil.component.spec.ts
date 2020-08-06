import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmMovilComponent } from './abm-movil.component';

describe('AbmMovilComponent', () => {
  let component: AbmMovilComponent;
  let fixture: ComponentFixture<AbmMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
