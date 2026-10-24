import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, map, throwError } from 'rxjs';
import { IBook } from '../classes/Book';

@Injectable({
  providedIn: 'root',
})
export class BookAPIService {
  constructor(private _http: HttpClient) {}

  getBooks(): Observable<IBook[]> {
    return this._http.get<IBook[]>('/books').pipe(retry(3), catchError(this.handleError));
  }

  getBook(bookId: string): Observable<IBook> {
    return this._http.get<IBook>(`/books/${bookId}`).pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Lỗi khi gọi API sách:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
  postBook(aBook: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.post<any>('/books', JSON.stringify(aBook), requestOptions).pipe(
      map((res) => JSON.parse(res) as Array<IBook>),
      retry(3),
      catchError(this.handleError),
    );
  }
}
