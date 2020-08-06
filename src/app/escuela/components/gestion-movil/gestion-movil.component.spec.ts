import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMovilComponent } from './gestion-movil.component';

describe('GestionMovilComponent', () => {
  let component: GestionMovilComponent;
  let fixture: ComponentFixture<GestionMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
