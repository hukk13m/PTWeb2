import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../classes/Iproduct';

@Injectable({
  providedIn: 'root',
})
export class ProductHttpService {
  private readonly _url = 'datasets/products1.json';

  constructor(private readonly _http: HttpClient) {}

  getProductList(): Observable<Product[]> {
    return this._http.get<Product[]>(this._url);
  }

  getProductbyID(id: number): Observable<Product | undefined> {
    return this.getProductList().pipe(
      map((products: Product[]) => products.find((p) => p.id === id)),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message));
  }
}
