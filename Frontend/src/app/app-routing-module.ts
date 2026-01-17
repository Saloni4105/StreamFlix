import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { VerifyEmail } from './verify-email/verify-email';
import { Home } from './user/home/home';
import { authGuard } from './shared/shared/guards/auth-guard';
import { adminGuard } from './shared/shared/guards/admin-guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { ResetPasswordComponent } from './reset-password/reset-password';

const routes: Routes = [
  { path: '', component: Landing },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'verify-email', component: VerifyEmail },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'admin',
    loadChildren:() => import('../app/admin/admin-module').then(m => m.AdminModule),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
