import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesHastaExamenComponent } from './clases-hasta-examen.component';

describe('ClasesHastaExamenComponent', () => {
  let component: ClasesHastaExamenComponent;
  let fixture: ComponentFixture<ClasesHastaExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasesHastaExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasesHastaExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
