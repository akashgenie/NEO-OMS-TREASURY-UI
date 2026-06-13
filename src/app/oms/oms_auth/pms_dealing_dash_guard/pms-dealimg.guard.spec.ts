import { TestBed } from '@angular/core/testing';

import { PmsDealimgGuard } from './pms-dealimg.guard';

describe('PmsDealimgGuard', () => {
  let guard: PmsDealimgGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PmsDealimgGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
