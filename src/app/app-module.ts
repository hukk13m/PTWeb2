import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Contact } from './contact/contact';
import { BindingPropertyComponent } from './binding-property-component/binding-property-component';
import { BindingClassComponent } from './binding-class-component/binding-class-component';
import { BindingStyleComponent } from './binding-style-component/binding-style-component';
import { BindingEventComponent } from './binding-event-component/binding-event-component';
import { Homework } from './homework/homework';
import { FormsModule } from '@angular/forms';
import { ProductDropdownListComponent } from './product-dropdown-list-component/product-dropdown-list-component';
import { ProductListCallServiceComponent } from './product-list-call-service-component/product-list-call-service-component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProductListCallHttpServiceComponent } from './product-list-call-http-service-component/product-list-call-http-service-component';
import { ProductHttpHandleErrorServiceComponent } from './product-http-handle-error-service-component/product-http-handle-error-service-component';
import { Ex13 } from './ex13/ex13';
import { ProductService } from './product.service/product.service';
import { ServiceProductImageEvent } from './service-product-image-event/service-product-image-event';
import { ServiceProductImageEventDetail } from './service-product-image-event-detail/service-product-image-event-detail';

@NgModule({
  declarations: [
    App,
    Contact,
    BindingPropertyComponent,
    BindingClassComponent,
    BindingStyleComponent,
    BindingEventComponent,
    Homework,
    ProductDropdownListComponent,
    ProductListCallServiceComponent,
    ProductListCallHttpServiceComponent,
    ProductHttpHandleErrorServiceComponent,
    Ex13,
    ProductService,
    ServiceProductImageEvent,
    ServiceProductImageEventDetail,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient(withInterceptorsFromDi())],

  bootstrap: [App],
})
export class AppModule {}
