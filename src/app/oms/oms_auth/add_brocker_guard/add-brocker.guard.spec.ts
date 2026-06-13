import { TestBed } from '@angular/core/testing';

import { AddBrockerGuard } from './add-brocker.guard';

describe('AddBrockerGuard', () => {
  let guard: AddBrockerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AddBrockerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
