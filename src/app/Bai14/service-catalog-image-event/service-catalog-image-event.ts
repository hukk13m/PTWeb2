import { Component } from '@angular/core';
import { CatalogService } from '../services/catalog-service';

@Component({
  selector: 'app-service-catalog-image-event',
  standalone: false,
  styleUrl: './service-catalog-image-event.css',
  templateUrl: './service-catalog-image-event.html',
})
export class ServiceCatalogImageEvent {
  public categories: any[];

  constructor(private ps: CatalogService) {
    this.categories = this.ps.getCategories();
  }
}
