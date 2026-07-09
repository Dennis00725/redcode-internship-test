import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'books', loadComponent: () => import('./pages/books/books.component').then(m => m.BooksComponent), canActivate: [authGuard] },
  { path: 'quotes', loadComponent: () => import('./pages/quotes/quotes.component').then(m => m.QuotesComponent), canActivate: [authGuard] },
];