import { TestBed } from '@angular/core/testing';

import { OpsGuard } from './ops.guard';

describe('OpsGuard', () => {
  let guard: OpsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OpsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
