import { TestBed } from '@angular/core/testing';

import { ReconsallationGuard } from './reconsallation.guard';

describe('ReconsallationGuard', () => {
  let guard: ReconsallationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReconsallationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
