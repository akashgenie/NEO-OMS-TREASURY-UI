import { TestBed } from '@angular/core/testing';

import { AifDashGuardGuard } from './aif-dash-guard.guard';

describe('AifDashGuardGuard', () => {
  let guard: AifDashGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AifDashGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
