import { TestBed } from '@angular/core/testing';

import { ScheduleworkService } from './schedulework.service';

describe('ScheduleworkService', () => {
  let service: ScheduleworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
