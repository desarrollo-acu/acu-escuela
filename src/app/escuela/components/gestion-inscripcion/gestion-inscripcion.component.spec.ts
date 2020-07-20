import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInscripcionComponent } from './gestion-inscripcion.component';

describe('GestionInscripcionComponent', () => {
  let component: GestionInscripcionComponent;
  let fixture: ComponentFixture<GestionInscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionInscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
