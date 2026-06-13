import { TestBed } from '@angular/core/testing';

import { BrokerUnlistedService } from './broker-unlisted.service';

describe('BrokerUnlistedService', () => {
  let service: BrokerUnlistedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerUnlistedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
