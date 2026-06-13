import { TestBed } from '@angular/core/testing';

import { BankerGuard } from './banker.guard';

describe('BankerGuard', () => {
  let guard: BankerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BankerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
