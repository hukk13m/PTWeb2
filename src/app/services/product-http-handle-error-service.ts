import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../classes/Iproduct';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductHttpHandleErrorService {
  private _url: string = 'datasets/products1.json';
  constructor(private _http: HttpClient) {}

  getProductsList(): Observable<Product[]> {
    return this._http.get<Product[]>(this._url).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getProductsList().pipe(
      map((products: Product[]) => products.find((p) => p.id === id)),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error: Unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side Error: ${error.error.message}`;
    } else {
      errorMessage = `
            Error Status: ${error.status}
            Error Message: ${error.message}
            `;
    }
    return throwError(() => new Error(errorMessage));
  }
}
