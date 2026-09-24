import { Component } from '@angular/core';
import { Product } from '../classes/Iproduct';
import { ProductService } from '../services/product-service';
@Component({
  selector: 'app-product-list-call-service-component',
  standalone: false,
  styleUrl: './product-list-call-service-component.css',
  templateUrl: './product-list-call-service-component.html',
})
export class ProductListCallServiceComponent {
  minPrice: number = 0;
  maxPrice: number = 100;
  products: Product[] = [];
  constructor(private ps: ProductService) {
    //this.products = this.ps.getProducts();
  }
  ngOnInit(): void {
    this.products = this.ps.getProducts();
  }
  doFilterbyPrice() {
    this.products = this.ps
      .getProducts()
      .filter((p) => p.price >= this.minPrice && p.price <= this.maxPrice);
  }
}
