import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../shared/services/auth-service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {


  if (req.url.includes('/auth/login') || req.url.includes('/auth/signup')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  let request = req;

  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error) => {

      if ((error.status === 401 || error.status === 403) && authService.isLoggedIn()) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
