import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/shared/services/auth-service';
import { NotificationService } from '../shared/shared/services/notification-service';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  loading = false;
  tokenValid = false;
  token = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notification: NotificationService
  ) {
    // FORM INITIALIZATION (NO ASYNC VALIDATOR ISSUE)
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    this.tokenValid = !!token;
    this.token = token || '';
  }

  // GROUP-LEVEL PASSWORD MATCH VALIDATOR
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  submit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const newPassword = this.resetPasswordForm.value.password;

    this.authService.resetPassword({
      token: this.token,
      newPassword
    }).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(
          response?.message || 'Password reset successfully'
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;

        const errorMsg =
          err?.error?.message ||
          'Failed to reset password. Please try again.';

        if (
          errorMsg.toLowerCase().includes('expired') ||
          errorMsg.toLowerCase().includes('invalid')
        ) {
          this.tokenValid = false;
        }

        this.notification.error(errorMsg);
      }
    });
  }
}
