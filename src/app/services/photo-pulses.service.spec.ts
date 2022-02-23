import { TestBed } from '@angular/core/testing';

import { PhotoPulsesService } from './photo-pulses.service';

describe('PhotoPulsesService', () => {
  let service: PhotoPulsesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoPulsesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
