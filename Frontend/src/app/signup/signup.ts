import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorHandlerService } from '../shared/shared/services/error-handler-service';
import { AuthService } from '../shared/shared/services/auth-service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../shared/shared/services/notification-service';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;
  signupForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private errorHandlerService: ErrorHandlerService) {

      this.signupForm = this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, this.authService.passwordMatchValidator('password')]]
      });
  }

  ngOnInit(): void {
      
    const email = this.route.snapshot.queryParams['email'];
    if(email) {
      this.signupForm.patchValue({ email: email });
      console.log(email);
    }
  }

  submit() {
  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched();
    return;
  }

  this.loading = true;

  const formData = this.signupForm.value;
  const data = {
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    fullName: formData.fullName
  };

  this.authService.signup(data).subscribe({
    next: (response: any) => {
      this.loading = false;
      this.notification.success(response?.message);
      this.router.navigate(['/login']);
    },
    error: (err: any) => {
      this.loading = false;
      this.errorHandlerService.handle(err, 'Registration failed. Please try again');
    }
  });
}

}
