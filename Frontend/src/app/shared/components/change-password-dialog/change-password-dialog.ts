import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../shared/services/auth-service';
import { NotificationService } from '../../shared/services/notification-service';
import { ErrorHandlerService } from '../../shared/services/error-handler-service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: false,
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.css',
})
export class ChangePasswordDialog {
  changePasswordForm !: FormGroup;
  loading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialog>,
    private authService: AuthService,
    private notification: NotificationService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    
    this.authService.changePassword({ currentPassword, newPassword }).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(response?.message || 'Password changed successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.errorHandlerService.handle(err, 'Failed to change password');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  }