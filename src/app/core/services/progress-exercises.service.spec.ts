import { TestBed } from '@angular/core/testing';

import { ProgressServiceService } from './progress-exercises.service';

describe('ProgressServiceService', () => {
  let service: ProgressServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
