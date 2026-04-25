import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage-serive';

describe('StorageSerive', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
