import { TestBed } from '@angular/core/testing';

import { WsaGuard } from './wsa.guard';

describe('WsaGuard', () => {
  let guard: WsaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WsaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
