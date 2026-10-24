import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Fashion } from './fashion.model';

@Injectable({ providedIn: 'root' })
export class FashionApiService {
  private readonly http = inject(HttpClient);
  private readonly url = '/fashions';

  getAll(style?: string): Observable<Fashion[]> {
    const params = style ? new HttpParams().set('style', style) : undefined;
    return this.http.get<Fashion[]>(this.url, { params }).pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Fashion> {
    return this.http
      .get<Fashion>(`${this.url}/${encodeURIComponent(id)}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const message =
      typeof error.error?.error === 'string' ? error.error.error : error.message;
    return throwError(() => new Error(message));
  }
}
