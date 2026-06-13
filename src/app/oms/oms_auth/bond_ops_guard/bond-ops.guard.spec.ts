import { TestBed } from '@angular/core/testing';

import { BondOpsGuard } from './bond-ops.guard';

describe('BondOpsGuard', () => {
  let guard: BondOpsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BondOpsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
