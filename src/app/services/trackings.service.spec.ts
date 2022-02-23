import { TestBed } from '@angular/core/testing';

import { TrackingsService } from './trackings.service';

describe('TrackingsService', () => {
  let service: TrackingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
