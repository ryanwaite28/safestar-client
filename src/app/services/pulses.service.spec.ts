import { TestBed } from '@angular/core/testing';

import { PulsesService } from './pulses.service';

describe('PulsesService', () => {
  let service: PulsesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PulsesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
