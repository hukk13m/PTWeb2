import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../classes/Iproduct';
@Injectable({
  providedIn: 'root',
})
export class ProductHttpService {
  private readonly _url = 'datasets/products.json';

  constructor(private readonly _http: HttpClient) {}

  getProductList(): Observable<Product[]> {
    return this._http.get<Product[]>(this._url);
  }
}
