import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Tier } from './tier/tier';

export const routes: Routes = [
    {path: '',component: Home},
    {path: 'tier/:plan',component: Tier}
    
];
