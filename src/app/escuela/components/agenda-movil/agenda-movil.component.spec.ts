import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaMovilComponent } from './agenda-movil.component';

describe('AgendaMovilComponent', () => {
  let component: AgendaMovilComponent;
  let fixture: ComponentFixture<AgendaMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
