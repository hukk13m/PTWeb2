import { Routes } from '@angular/router';
import { FashionDetailComponent } from './fashion-detail.component';
import { FashionHomeComponent } from './fashion-home.component';

export const routes: Routes = [
  { path: '', component: FashionHomeComponent },
  { path: 'fashion/:id', component: FashionDetailComponent },
  { path: '**', redirectTo: '' },
];
