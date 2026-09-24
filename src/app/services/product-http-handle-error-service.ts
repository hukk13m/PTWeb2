import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Product } from '../classes/Iproduct';

@Injectable({
  providedIn: 'root',
})
export class ProductHttpHandleErrorService {
  private _url: string = '/datasets/products.json';

  constructor(private httpClient: HttpClient) {}

  getProductlist(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this._url).pipe(retry(3), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
