import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesEstimadasComponent } from './clases-estimadas.component';

describe('ClasesEstimadasComponent', () => {
  let component: ClasesEstimadasComponent;
  let fixture: ComponentFixture<ClasesEstimadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasesEstimadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasesEstimadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
