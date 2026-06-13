import { TestBed } from '@angular/core/testing';

import { BlockOrderAuthGuard } from './block-order-auth.guard';

describe('BlockOrderAuthGuard', () => {
  let guard: BlockOrderAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BlockOrderAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
