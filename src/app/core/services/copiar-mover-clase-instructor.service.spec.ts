import { TestBed } from '@angular/core/testing';

import { CopiarMoverClaseInstructorService } from './copiar-mover-clase-instructor.service';

describe('CopiarMoverClaseInstructorService', () => {
  let service: CopiarMoverClaseInstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopiarMoverClaseInstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
