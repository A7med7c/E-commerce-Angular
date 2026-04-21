import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
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


  verifyEmail: FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]]
  })

  verifyCode: FormGroup = this._formBuilder.group({
    code: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
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
      let email = this.verifyEmail.get('email')?.value;
      this.resetPassword.get('email')?.patchValue(email);

      this._authService.sendCode(this.verifyEmail.value).subscribe({
        next: (res) => {
          if (res.statusMsg === 'success')
            this.step = 2;
          console.log(res)
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(err.message)
        }
      })
    }
    else {
      this.verifyEmail.markAllAsTouched();
    }
  }

  codeVerification(): void {
    if (this.verifyCode.valid) {
      this.isLoading = true;
      this._authService.sendCode(this.verifyCode.value).subscribe({
        next: (res) => {
          if (res.status === 'Success') {
            this.step = 3;
            console.log(res);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(err.message)
        }
      })
    }
    else {
      this.verifyCode.markAllAsTouched();
    }
  }

  resetPasswordVerification(): void {
    if (this.resetPassword.valid) {
      this.isLoading = true;
      this._authService.sendCode(this.resetPassword.value).subscribe({
        next: (res) => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this._authService.saveUserDate();
          this._router.navigate(['/home']);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(err.message)
        }
      })
    }
    else {
      this.resetPassword.markAllAsTouched();
    }
  }


}
