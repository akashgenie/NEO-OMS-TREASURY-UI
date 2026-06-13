import { TestBed } from '@angular/core/testing';

import { BrockerDetailsService } from './brocker-details.service';

describe('BrockerDetailsService', () => {
  let service: BrockerDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrockerDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
