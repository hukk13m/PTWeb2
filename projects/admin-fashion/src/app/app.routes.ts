import { Routes } from '@angular/router';
import { FashionDetailComponent } from './fashion-detail.component';
import { FashionEditorComponent } from './fashion-editor.component';
import { FashionListComponent } from './fashion-list.component';

export const routes: Routes = [
  { path: '', component: FashionListComponent },
  { path: 'new', component: FashionEditorComponent },
  { path: ':id/edit', component: FashionEditorComponent },
  { path: ':id', component: FashionDetailComponent },
  { path: '**', redirectTo: '' },
];
