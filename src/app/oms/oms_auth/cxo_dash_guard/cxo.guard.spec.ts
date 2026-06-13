import { TestBed } from '@angular/core/testing';

import { CxoGuard } from './cxo.guard';

describe('CxoGuard', () => {
  let guard: CxoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CxoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
