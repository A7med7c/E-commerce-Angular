import { NgClass } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/Services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword {

  isLoading: boolean = false;
  showPassword: boolean = false;
  step: number = 1;

  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _cdr = inject(ChangeDetectorRef);

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
    this.showPassword = !this.showPassword;
  }

  emailVerification(): void {
    if (this.verifyEmail.valid) {
      this.isLoading = true;
      const email = this.verifyEmail.get('email')?.value;
      this.resetPassword.get('email')?.patchValue(email);

      this._authService.sendCode(this.verifyEmail.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.step = 2;
          this._cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(err.message);
          this._cdr.detectChanges();
        }
      });
    } else {
      this.verifyEmail.markAllAsTouched();
    }
  }

  codeVerification(): void {
    if (this.verifyCode.valid) {
      this.isLoading = true;

      this._authService.codeVerification(this.verifyCode.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.step = 3;
          this._cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(err.message);
          this._cdr.detectChanges();
        }
      });
    } else {
      this.verifyCode.markAllAsTouched();
    }
  }

  resetPasswordVerification(): void {
    if (this.resetPassword.valid) {
      this.isLoading = true;

      this._authService.setNewPassword(this.resetPassword.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          localStorage.setItem('token', res.token);
          this._authService.saveUserDate();
          this._cdr.detectChanges();
          this._router.navigate(['/home']);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(err.message);
          this._cdr.detectChanges();
        }
      });
    } else {
      this.resetPassword.markAllAsTouched();
    }
  }
}