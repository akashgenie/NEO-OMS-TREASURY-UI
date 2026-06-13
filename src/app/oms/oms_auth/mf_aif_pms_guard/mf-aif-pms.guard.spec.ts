import { TestBed } from '@angular/core/testing';

import { MfAifPmsGuard } from './mf-aif-pms.guard';

describe('MfAifPmsGuard', () => {
  let guard: MfAifPmsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MfAifPmsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
