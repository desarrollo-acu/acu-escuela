import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatidadClasesPorInstructorComponent } from './catidad-clases-por-instructor.component';

describe('CatidadClasesPorInstructorComponent', () => {
  let component: CatidadClasesPorInstructorComponent;
  let fixture: ComponentFixture<CatidadClasesPorInstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatidadClasesPorInstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatidadClasesPorInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
