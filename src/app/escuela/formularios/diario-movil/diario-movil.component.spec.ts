import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarioMovilComponent } from './diario-movil.component';

describe('DiarioMovilComponent', () => {
  let component: DiarioMovilComponent;
  let fixture: ComponentFixture<DiarioMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiarioMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarioMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
