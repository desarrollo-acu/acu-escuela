import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReanudarClasesSuspendidasComponent } from './reanudar-clases-suspendidas.component';

describe('ReanudarClasesSuspendidasComponent', () => {
  let component: ReanudarClasesSuspendidasComponent;
  let fixture: ComponentFixture<ReanudarClasesSuspendidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReanudarClasesSuspendidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReanudarClasesSuspendidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
