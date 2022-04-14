import { TestBed } from '@angular/core/testing';

import { ExportTransactionService } from './export-transaction.service';

describe('ExportTransactionService', () => {
  let service: ExportTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
