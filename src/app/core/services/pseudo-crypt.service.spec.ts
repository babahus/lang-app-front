import { TestBed } from '@angular/core/testing';

import { PseudoCryptService } from './pseudo-crypt.service';

describe('PsevdoCrypterService', () => {
  let service: PseudoCryptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudoCryptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
