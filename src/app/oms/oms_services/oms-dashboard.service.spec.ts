import { TestBed } from '@angular/core/testing';

import { OmsDashboardService } from './oms-dashboard.service';

describe('OmsDashboardService', () => {
  let service: OmsDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OmsDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
