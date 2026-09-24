import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ServiceProductImageEvent } from './Bai13/service-product-image-event/service-product-image-event';
import { ServiceProductImageEventDetailComponent } from './Bai13/service-product-image-event-detail/service-product-image-event-detail';
import { ServiceCatalogImageEvent } from './Bai14/service-catalog-image-event/service-catalog-image-event';
import { CatalogService } from './Bai14/services/catalog-service';
import { Customers } from './Bai18/customers/customers';

@NgModule({
  declarations: [
    App,
    ServiceProductImageEvent,
    ServiceProductImageEventDetailComponent,
    ServiceCatalogImageEvent,
    Customers,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [CatalogService, provideHttpClient(), provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
