import { TestBed } from '@angular/core/testing';

import { FmGuard } from './fm.guard';

describe('FmGuard', () => {
  let guard: FmGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FmGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
