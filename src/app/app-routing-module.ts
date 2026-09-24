import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceProductImageEvent } from './Bai13/service-product-image-event/service-product-image-event';
import { ServiceProductImageEventDetailComponent } from './Bai13/service-product-image-event-detail/service-product-image-event-detail';
import { ServiceCatalogImageEvent } from './Bai14/service-catalog-image-event/service-catalog-image-event';
import { Customers } from './Bai18/customers/customers';

const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: Customers },
  { path: 'service-catalog-image-event', component: ServiceCatalogImageEvent },
  { path: 'service-product-image-event', component: ServiceProductImageEvent },
  { path: 'service-product-image-event/:id', component: ServiceProductImageEventDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
