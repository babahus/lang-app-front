import { TestBed } from '@angular/core/testing';

import { AuthorizeInterceptorService } from './authorize-interceptor.service';

describe('AuthorizeInterceptorService', () => {
  let service: AuthorizeInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizeInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
