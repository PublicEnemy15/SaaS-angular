import { Routes } from '@angular/router';

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
    path: 'platform',
    loadComponent: () => import('./platform/platform').then((m) => m.PlatformPage),
    title: 'Dashboard',
  },
  {
    path: 'dashboard/comments',
    loadComponent: () => import('./comments/comments').then((m) => m.ComentariosComponent),
    title: 'Comentarios',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];