import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  passwordMatchValidator(passwordControlName: string): ValidatorFn {
    return (confirmControl: AbstractControl): ValidationErrors | null => {
      if (!confirmControl.parent) return null;

      const password =
        confirmControl.parent.get(passwordControlName)?.value;

      const confirmPassword = confirmControl.value;

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
  }

  signup(signupData: any) {
    return this.http.post(this.apiUrl + '/signup', signupData);
  }

  verifyEmail(token: string) {
    return this.http.get(this.apiUrl + '/verify-email?token=' + token);
  }

  login(loginData: any) {
    return this.http.post(this.apiUrl + '/login', loginData).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  handleAuthSuccess(authData: any) {
    if (authData?.token) {
      localStorage.setItem('token', authData.token);
    }
    this.setCurrentUser(authData);
    this.redirectBasedOnRole();
  }

  setCurrentUser(user: any | null) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  redirectBasedOnRole() {
    const targetUrl = this.isAdmin() ? '/admin' : '/home';
    this.router.navigate([targetUrl]);
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  resendVerificationEmail(email: string) {
    return this.http.post(this.apiUrl + '/resend-verification', { email });
  }
}
