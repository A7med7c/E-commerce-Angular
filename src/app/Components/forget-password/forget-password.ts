import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/Services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword {

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly step = signal(1);

  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastrService);

  verifyEmail: FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]]
  })

  verifyCode: FormGroup = this._formBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
  })

  resetPassword: FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]]
  })

  togglePassword() {
    this.showPassword.update((value) => !value);
  }

  emailVerification(): void {
    if (this.verifyEmail.valid) {
      this.isLoading.set(true);
      const email = this.verifyEmail.get('email')?.value;
      this.resetPassword.get('email')?.patchValue(email);

      this._authService.sendCode(this.verifyEmail.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.step.set(2);
          this._toast.success(res.message || 'Code has sent  successfully');
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this._toast.error(err.error?.message || 'Something went wrong');
          console.log(err.message);
        }
      });
    } else {
      this.verifyEmail.markAllAsTouched();
      this._toast.warning('Please complete the required fields');
    }
  }

  codeVerification(): void {
    if (this.verifyCode.valid) {
      this.isLoading.set(true);

      this._authService.codeVerification(this.verifyCode.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.step.set(3);
          this._toast.success(res.message || 'Successfull code');
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this._toast.error(err.error?.message || 'Something went wrong');
          console.log(err.message);
        }
      });
    } else {
      this.verifyCode.markAllAsTouched();
      this._toast.warning('Please complete the required fields');
    }
  }

  resetPasswordVerification(): void {
    if (this.resetPassword.valid) {
      this.isLoading.set(true);

      this._authService.setNewPassword(this.resetPassword.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this._toast.success(res.message || 'Password reste complete successfully');

          // Store token immediately
          localStorage.setItem('token', res.token);
          this._authService.saveUserData();

          // Brief delay for UX (optional)
          setTimeout(() => {
            this._router.navigate(['/home']);
          }, 100);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this._toast.error(err.error?.message || 'Something went wrong');
          console.log(err.message);
        }
      });
    } else {
      this.resetPassword.markAllAsTouched();
      this._toast.warning('Please complete the required fields');
    }
  }
}