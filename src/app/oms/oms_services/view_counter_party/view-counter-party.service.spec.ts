import { TestBed } from '@angular/core/testing';

import { ViewCounterPartyService } from './view-counter-party.service';

describe('ViewCounterPartyService', () => {
  let service: ViewCounterPartyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewCounterPartyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
