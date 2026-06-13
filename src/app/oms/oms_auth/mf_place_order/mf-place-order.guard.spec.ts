import { TestBed } from '@angular/core/testing';

import { MfPlaceOrderGuard } from './mf-place-order.guard';

describe('MfPlaceOrderGuard', () => {
  let guard: MfPlaceOrderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MfPlaceOrderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
