import { TestBed } from '@angular/core/testing';

import { PlaceOrderGuard } from './place-order.guard';

describe('PlaceOrderGuard', () => {
  let guard: PlaceOrderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PlaceOrderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
