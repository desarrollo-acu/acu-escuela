import { TestBed } from '@angular/core/testing';

import { AcuService } from './acu.service';

describe('AcuService', () => {
  let service: AcuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
