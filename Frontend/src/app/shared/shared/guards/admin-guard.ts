import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Admin guard check:');
  console.log('Is logged in:', authService.isLoggedIn());
  console.log('Is admin:', authService.isAdmin());
  console.log('Current user:', authService.getCurrentUser());

  if(authService.isLoggedIn() && authService.isAdmin())
  {
    console.log('Admin access granted');
    return true;
  }

  console.log('Admin access denied, redirecting to home');
  router.navigate(['/home']);
  return false;
};
