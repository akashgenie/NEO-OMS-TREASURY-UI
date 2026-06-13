import { TestBed } from '@angular/core/testing';

import { MfAifOpsGuard } from './mf-aif-ops.guard';

describe('MfAifOpsGuard', () => {
  let guard: MfAifOpsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MfAifOpsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
