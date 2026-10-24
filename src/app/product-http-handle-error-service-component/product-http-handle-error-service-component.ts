import { Component, signal } from '@angular/core';
import { Product } from '../classes/Iproduct';
import { ProductHttpHandleErrorService } from '../services/product-http-handle-error-service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-product-http-handle-error-service-component',
  standalone: false,
  styleUrl: './product-http-handle-error-service-component.css',
  templateUrl: './product-http-handle-error-service-component.html',
})
export class ProductHttpHandleErrorServiceComponent {
  products = signal<Product[]>([]);
  errorMessage = signal('');

  constructor(private _service: ProductHttpHandleErrorService) {}

  getProductList(): Observable<Product[]> {
    return this._service
      .getProductsList()
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getProductList().pipe(
      map((products: Product[]) => products.find((p) => p.id === id)),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  ngOnInit(): void {
    this.getProductList().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.message);
      },
    });
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message));
  }
}
