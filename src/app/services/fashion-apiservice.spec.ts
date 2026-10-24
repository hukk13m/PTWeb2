import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Fashion } from '../classes/Fashion';
import { FashionAPIService } from './fashion-apiservice';

describe('FashionAPIService', () => {
  let service: FashionAPIService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FashionAPIService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts a fashion as JSON', () => {
    const fashion = new Fashion(
      null,
      'Flex',
      'King',
      'TFT',
      'data:image/jpeg;base64,abc',
    );
    let response: unknown;

    service.postFashion(fashion).subscribe((data) => {
      response = data;
    });

    const request = httpTestingController.expectOne('/fashions');
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Content-Type')).toBe('application/json');
    expect(request.request.body).toEqual(fashion);
    request.flush({ ...fashion, _id: 'fashion-id' });

    expect(response).toEqual({ ...fashion, _id: 'fashion-id' });
  });
});
