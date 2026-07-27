import { Routes } from '@angular/router';
import { RecipeList } from './features/recipes/recipe-list/recipe-list';
import { RecipeForm } from './features/recipes/recipe-form/recipe-form';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'recipes', component: RecipeList},
    { path: 'recipes/new', component: RecipeForm},
    { path: 'recipes/edit/:id', component: RecipeForm},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
