import { TestBed } from '@angular/core/testing';

import { PanVerifyDecryptedService } from './pan-verify-decrypted.service';

describe('PanVerifyDecryptedService', () => {
  let service: PanVerifyDecryptedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanVerifyDecryptedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
