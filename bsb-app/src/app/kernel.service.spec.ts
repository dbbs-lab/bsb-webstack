import { TestBed } from '@angular/core/testing';

import { KernelService } from './kernel.service';

describe('KernelService', () => {
  let service: KernelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KernelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
