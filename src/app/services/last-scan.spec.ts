import { TestBed } from '@angular/core/testing';

import { LastScanService } from './last-scan';

describe('LastScan', () => {
  let service: LastScanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastScanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
