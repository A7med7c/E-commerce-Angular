import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Core/Services/auth-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _authService = inject(AuthService)
  private readonly _router = inject(Router)
  private readonly _cdr = inject(ChangeDetectorRef)


  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  success: boolean = false;


  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]]
  })
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this._authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.message === 'success') {
            this.success = true;
            setTimeout(() => {
              this._router.navigate(['/home']);
            }, 1000);
          }
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.message;
          this.isLoading = false;
          this._cdr.detectChanges();
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
