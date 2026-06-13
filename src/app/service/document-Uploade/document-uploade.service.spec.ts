import { TestBed } from '@angular/core/testing';

import { DocumentUploadeService } from './document-uploade.service';

describe('DocumentUploadeService', () => {
  let service: DocumentUploadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentUploadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
