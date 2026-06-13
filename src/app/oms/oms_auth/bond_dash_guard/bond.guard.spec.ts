import { TestBed } from '@angular/core/testing';

import { BondGuard } from './bond.guard';

describe('BondGuard', () => {
  let guard: BondGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BondGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
