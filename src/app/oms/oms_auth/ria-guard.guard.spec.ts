import { TestBed } from '@angular/core/testing';

import { RIAGuardGuard } from './ria-guard.guard';

describe('RIAGuardGuard', () => {
  let guard: RIAGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RIAGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
