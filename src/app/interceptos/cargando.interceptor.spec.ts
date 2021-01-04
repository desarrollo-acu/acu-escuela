import { TestBed } from '@angular/core/testing';

import { CargandoInterceptor } from './cargando.interceptor';

describe('CargandoInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CargandoInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: CargandoInterceptor = TestBed.inject(CargandoInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
