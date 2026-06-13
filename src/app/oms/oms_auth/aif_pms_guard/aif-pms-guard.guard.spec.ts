import { TestBed } from '@angular/core/testing';

import { AifPmsGuardGuard } from './aif-pms-guard.guard';

describe('AifPmsGuardGuard', () => {
  let guard: AifPmsGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AifPmsGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
