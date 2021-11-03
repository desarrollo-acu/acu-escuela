import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFormulariosComponent } from './gestion-formularios.component';

describe('GestionFormulariosComponent', () => {
  let component: GestionFormulariosComponent;
  let fixture: ComponentFixture<GestionFormulariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionFormulariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionFormulariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
