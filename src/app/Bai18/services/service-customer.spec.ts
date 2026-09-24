import { TestBed } from '@angular/core/testing';
import { ServiceCustomer } from './service-customer';

describe('ServiceCustomer', () => {
  let service: ServiceCustomer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCustomer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
