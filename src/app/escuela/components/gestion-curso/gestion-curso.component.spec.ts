import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCursoComponent } from './gestion-curso.component';

describe('GestionCursoComponent', () => {
  let component: GestionCursoComponent;
  let fixture: ComponentFixture<GestionCursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
