import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list-component/product-list-component';
import { ProductDropdownListComponent } from './product-dropdown-list-component/product-dropdown-list-component';
import { ProductListCallServiceComponent } from './product-list-call-service-component/product-list-call-service-component';
import { ProductListCallHttpServiceComponent } from './product-list-call-http-service-component/product-list-call-http-service-component';
import { ProductDetailComponent } from './product-detail-component/product-detail-component';
import { ProductListAdvancedComponent } from './product-list-advanced-component/product-list-advanced-component';
import { ProductListSearchComponent } from './product-list-search-component/product-list-search-component';
import { PayNotFoundComponents } from './pay-not-found-components/pay-not-found-components';
import { Contact } from './contact/contact';
import { authGuard } from './classes/auth';
import { CourseRegistrationComponent } from './course-registration-component/course-registration-component';
import { LoginComponent } from './login-component/login-component';
import { CourseRegistrationReactive } from './course-registration-reactive/course-registration-reactive';
import { FakeProductComponent } from './fake-product-component/fake-product-component';
import { BooksComponent } from './books-component/books-component';
import { BookDetailComponent } from './book-detail-component/book-detail-component';
import { BookNewComponent } from './book-new-component/book-new-component';
import { FashionComponent } from './fashion-component/fashion-component';
import { FashionDetailComponent } from './fashion-detail-component/fashion-detail-component';
import { FashionNewComponent } from './fashion-new-component/fashion-new-component';
import { FashionUpdateComponent } from './fashion-update-component/fashion-update-component';
import { FashionDeleteComponent } from './fashion-delete-component/fashion-delete-component';
import { FashionSearchComponent } from './fashion-search-component/fashion-search-component';

const routes: Routes = [
  { path: 'learn-directive', component: ProductListComponent },
  { path: 'product-dropdown-list', component: ProductDropdownListComponent },
  { path: 'product-list-call-service', component: ProductListCallServiceComponent },
  { path: 'product-list-call-http-service', component: ProductListCallHttpServiceComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'products', component: ProductListAdvancedComponent },
  { path: 'searchproduct', component: ProductListSearchComponent },

  {
    path: 'sample-nested',
    component: ProductListAdvancedComponent,
    children: [
      { path: 'search', component: ProductListSearchComponent },
      { path: 'detail/:id', component: ProductDetailComponent },
    ],
  },
  {
    path: 'lazyinfo',
    loadComponent: () => import('./lazy-component/lazy-component').then((c) => c.LazyComponent),
    canActivate: [authGuard],
  },
  { path: 'course-register', component: CourseRegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'course-reactive-register', component: CourseRegistrationReactive },
  { path: '', component: Contact },
  { path: 'contact', component: Contact },
  { path: 'fake_product', component: FakeProductComponent },
  { path: 'book-list', component: BooksComponent },
  { path: 'book-detail', component: BookDetailComponent },
  { path: 'book-new', component: BookNewComponent },
  { path: 'fashion', component: FashionComponent },
  { path: 'fashion/:slug', component: FashionDetailComponent },
  // Giữ link cũ hoạt động, nhưng chuyển sang URL slug mới.
  { path: 'fashion-list', redirectTo: 'fashion', pathMatch: 'full' },
  { path: 'fashion-detail', redirectTo: 'fashion', pathMatch: 'full' },
  { path: 'fashion-new', component: FashionNewComponent },
  { path: 'fashion-update', component: FashionUpdateComponent },
  { path: 'fashion-delete', component: FashionDeleteComponent },
  { path: 'fashion-search', component: FashionSearchComponent },
  { path: '**', component: PayNotFoundComponents },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
