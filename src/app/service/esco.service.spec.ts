import { TestBed } from '@angular/core/testing';

import { EscoService } from './esco.service';

describe('EscoService', () => {
  let service: EscoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
