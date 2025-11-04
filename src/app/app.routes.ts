import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
    title: 'Home - SaaS Angular',
  },
  {
    path: 'tier/:plan',
    loadComponent: () => import('./tier/tier').then((m)=> m.Tier),
    title: 'Contratar Plan'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.Register),
    title: 'Register',
  },
  {
    path: 'platform/domains',
    loadComponent: () => import('./platform/platform').then((m) => m.PlatformPage),
    canActivate: [authGuard],
    title: 'Platform - Domains',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];