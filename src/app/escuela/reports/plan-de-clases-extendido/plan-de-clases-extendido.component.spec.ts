import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDeClasesExtendidoComponent } from './plan-de-clases-extendido.component';

describe('PlanDeClasesExtendidoComponent', () => {
  let component: PlanDeClasesExtendidoComponent;
  let fixture: ComponentFixture<PlanDeClasesExtendidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDeClasesExtendidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDeClasesExtendidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
