import { Service } from '@angular/core';
import { Product } from '../classes/Iproduct';

@Service()
export class ProductService {
  products: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      price: 999,
      image: 'https://cdn.phuckhangmobile.com/image/iphone-14-xanh-26577j.jpg',
    },
    {
      id: 2,
      name: 'Iphone18',
      price: 999,
      image: 'https://cdn.phuckhangmobile.com/image/iphone-14-den-26575j.jpg',
    },
    {
      id: 3,
      name: 'Samsung',
      price: 999,
      image: 'https://cdn.phuckhangmobile.com/image/khach-hang-phuckhangmobile10-23424j.jpg',
    },
    {
      id: 4,
      name: 'Huawei',
      price: 999,
      image: 'https://cdn.phuckhangmobile.com/image/iphone-14-6-27222j.jpg',
    },
    {
      id: 5,
      name: 'Chicken',
      price: 999,
      image: 'https://cdn.phuckhangmobile.com/image/khach-hang-phuckhangmobile7-23421j.jpg',
    },
  ];
  constructor() {}
  getProducts() {
    return this.products;
  }
}
