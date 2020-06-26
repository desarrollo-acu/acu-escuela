import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaCursoComponent } from './agenda-curso.component';

describe('AgendaCursoComponent', () => {
  let component: AgendaCursoComponent;
  let fixture: ComponentFixture<AgendaCursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaCursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
