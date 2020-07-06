import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmCursoComponent } from './abm-curso.component';

describe('AbmCursoComponent', () => {
  let component: AbmCursoComponent;
  let fixture: ComponentFixture<AbmCursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmCursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
