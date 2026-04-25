import { TestBed } from '@angular/core/testing';

import { StorageSerive } from './storage-serive';

describe('StorageSerive', () => {
  let service: StorageSerive;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageSerive);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
