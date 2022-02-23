import { TestBed } from '@angular/core/testing';

import { CheckpointsService } from './checkpoints.service';

describe('CheckpointsService', () => {
  let service: CheckpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckpointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
