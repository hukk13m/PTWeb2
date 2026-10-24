import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Fashion } from '../classes/Fashion';
import { findFashionBySlug } from '../classes/FashionSlug';

@Injectable({
  providedIn: 'root',
})
export class FashionAPIService {
  headers = new HttpHeaders().set('Content-Type', 'text/plain;charset=utf-8');
  requestOptions: Object = {
    headers: this.headers,
    responseType: 'text',
  };
  constructor(private _http: HttpClient) {}
  getFashions(): Observable<any> {
    return this._http.get<any>('/fashions', this.requestOptions).pipe(
      map((res) => JSON.parse(res) as Array<Fashion>),
      retry(3),
      catchError(this.handleError),
    );
  }
  getFashion(id: string | number): Observable<any> {
    return this._http.get<any>('/fashions/' + id, this.requestOptions).pipe(
      map((res) => JSON.parse(res) as Fashion),
      retry(3),
      catchError(this.handleError),
    );
  }
  /**
   * Tìm Fashion theo slug. Service tải danh sách rồi so khớp slug nên
   * URL có thể được mở trực tiếp và tải lại trang vẫn ra đúng Fashion.
   */
  getFashionBySlug(slug: string): Observable<Fashion | null> {
    return this.getFashions().pipe(
      map((fashions: Fashion[]) => findFashionBySlug(fashions, slug)),
      catchError(this.handleError),
    );
  }
  postFashion(aFashion: Fashion): Observable<Fashion> {
    return this._http.post<Fashion>('/fashions', aFashion).pipe(catchError(this.handleError));
  }
  putFashion(aFashion: Fashion): Observable<Fashion> {
    return this._http.put<Fashion>('/fashions', aFashion).pipe(catchError(this.handleError));
  }
  deleteFashion(fashionId: string): Observable<any> {
    return this._http.delete<any>('/fashions/' + fashionId, this.requestOptions).pipe(
      map((res) => JSON.parse(res) as Fashion),
      retry(3),
      catchError(this.handleError),
    );
  }
  handleError(error: HttpErrorResponse) {
    const message =
      typeof error.error?.error === 'string' ? error.error.error : error.message;
    return throwError(() => new Error(message));
  }
}
