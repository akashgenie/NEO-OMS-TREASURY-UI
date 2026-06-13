import { TestBed } from '@angular/core/testing';

import { EncryptionWrapperService } from './encryption-wrapper.service';

describe('EncryptionWrapperService', () => {
  let service: EncryptionWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptionWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
