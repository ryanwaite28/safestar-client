import { TestBed } from '@angular/core/testing';

import { ReplyService } from './replies-service.service';

describe('ReplyService', () => {
  let service: ReplyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
