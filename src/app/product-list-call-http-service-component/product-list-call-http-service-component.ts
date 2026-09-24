import { Component, signal } from '@angular/core';
import { Product } from '../classes/Iproduct';
import { ProductHttpService } from '../services/product-http-service';

@Component({
  selector: 'app-product-list-call-http-service-component',
  standalone: false,
  styleUrl: './product-list-call-http-service-component.css',
  templateUrl: './product-list-call-http-service-component.html',
})
export class ProductListCallHttpServiceComponent {
  products = signal<Product[]>([]);

  constructor(private _service: ProductHttpService) {}
  ngOnInit(): void {
    this._service.getProductList().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => {
        alert('lỗi' + JSON.stringify(err));
      },
    });
  }
}
