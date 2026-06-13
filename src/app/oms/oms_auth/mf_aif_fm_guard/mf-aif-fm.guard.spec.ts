import { TestBed } from '@angular/core/testing';

import { MfAifFmGuard } from './mf-aif-fm.guard';

describe('MfAifFmGuard', () => {
  let guard: MfAifFmGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MfAifFmGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
