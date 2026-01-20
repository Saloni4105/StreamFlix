import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { VerifyEmail } from './verify-email/verify-email';
import { Home } from './user/home/home';
import { authGuard } from './shared/shared/guards/auth-guard';
import { adminGuard } from './shared/shared/guards/admin-guard';
import { MyFavorites } from './user/my-favorites/my-favorites';

const routes: Routes = [
  { path: '', component: Landing },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'verify-email', component: VerifyEmail },
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password').then(m => m.ResetPasswordComponent) },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'my-favorites', component: MyFavorites, canActivate: [authGuard] },
  {
    path: 'admin',
    loadChildren: () => import('../app/admin/admin-module').then(m => m.AdminModule),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
