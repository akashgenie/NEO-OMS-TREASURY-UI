import { TestBed } from '@angular/core/testing';

import { SessionManagerInterceptor } from './session-manager.interceptor';

describe('SessionManagerInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [SessionManagerInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: SessionManagerInterceptor = TestBed.inject(
      SessionManagerInterceptor,
    );
    expect(interceptor).toBeTruthy();
  });
});
