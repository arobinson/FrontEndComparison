import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  {
    path: 'list',
    loadComponent: () =>
      import('./products/list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./products/detail/product-detail').then((m) => m.ProductDetail),
  },
  { path: '**', redirectTo: '/list' },
];
