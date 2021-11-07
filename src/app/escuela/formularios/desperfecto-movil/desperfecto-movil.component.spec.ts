import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesperfectoMovilComponent } from './desperfecto-movil.component';

describe('DesperfectoMovilComponent', () => {
  let component: DesperfectoMovilComponent;
  let fixture: ComponentFixture<DesperfectoMovilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesperfectoMovilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesperfectoMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
