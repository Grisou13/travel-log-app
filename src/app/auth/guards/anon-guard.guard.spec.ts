import { TestBed } from '@angular/core/testing';

import { anonGuard } from './auth-guard.guard';

describe('anonGuard', () => {
  let guard: ReturnType<typeof anonGuard>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(anonGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
