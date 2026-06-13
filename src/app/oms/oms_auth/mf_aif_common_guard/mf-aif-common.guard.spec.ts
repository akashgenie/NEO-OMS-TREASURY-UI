import { TestBed } from '@angular/core/testing';

import { MfAifCommonGuard } from './mf-aif-common.guard';

describe('MfAifCommonGuard', () => {
  let guard: MfAifCommonGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MfAifCommonGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
