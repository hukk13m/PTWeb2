import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from '../classes/Iproduct';
import { ProductHttpHandleErrorService } from '../services/product-http-handle-error-service';
import { createSlug } from '../classes/SlugHelper';
@Component({
  selector: 'app-product-list-advanced-component',
  standalone: false,
  styleUrl: './product-list-advanced-component.css',
  templateUrl: './product-list-advanced-component.html',
})
export class ProductListAdvancedComponent {
  products = signal<Product[]>([]);
  errMessage = signal('');
  public generateSlug = createSlug;

  constructor(
    private readonly _service: ProductHttpHandleErrorService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.getProductList().subscribe({
      next: (data: Product[]) => {
        this.products.set(data);
      },
      error: (err: HttpErrorResponse) => {
        this.errMessage.set(err.message);
      },
    });
  }

  getProductList() {
    return this._service.getProductsList();
  }

  viewDetail(id: number): void {
    this.router.navigate(['/products', id]);
  }
  viewDetailSlug(p: Product) {
    let slug = this.generateSlug(p.name, p.id);
    this.router.navigate(['/products', slug]);
  }
}
