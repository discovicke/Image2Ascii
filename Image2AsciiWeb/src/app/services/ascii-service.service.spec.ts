import { TestBed } from '@angular/core/testing';

import { AsciiService } from './ascii.service';

describe('AsciiService', () => {
  let service: AsciiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsciiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
