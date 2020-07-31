import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmInscripcionComponent } from './abm-inscripcion.component';

describe('AbmInscripcionComponent', () => {
  let component: AbmInscripcionComponent;
  let fixture: ComponentFixture<AbmInscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmInscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
