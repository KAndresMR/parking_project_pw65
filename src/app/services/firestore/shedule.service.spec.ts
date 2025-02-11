import { TestBed } from '@angular/core/testing';

import { SheduleService } from './shedule.service';

describe('SheduleService', () => {
  let service: SheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
