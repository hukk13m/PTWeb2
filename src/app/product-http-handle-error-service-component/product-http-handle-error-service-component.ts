import { Component, signal } from '@angular/core';
import { Product } from '../classes/Iproduct';
import { ProductHttpHandleErrorService } from '../services/product-http-handle-error-service';

@Component({
  selector: 'app-product-http-handle-error-service-component',
  standalone: false,
  styleUrl: './product-http-handle-error-service-component.css',
  templateUrl: './product-http-handle-error-service-component.html',
})
export class ProductHttpHandleErrorServiceComponent {
  products = signal<Product[]>([]);
  errMessage = signal('');

  constructor(private _service: ProductHttpHandleErrorService) {}

  ngOnInit(): void {
    this._service.getProductlist().subscribe({
      next: (data: Product[]) => {
        this.products.set(data);
      },
      error: (err: any) => {
        this.errMessage.set(err.message || 'Something went wrong');
      },
    });
  }
}
