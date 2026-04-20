import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Core/Services/auth-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _authService = inject(AuthService)
  private readonly _router = inject(Router)
  private readonly _cdr = inject(ChangeDetectorRef)


  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  success: boolean = false;
  productsSubscribtion!: Subscription


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
      this.errorMessage = '';
      this.success = false;

      this.productsSubscribtion = this._authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.message === 'success') {
            this.success = true;
            this.loginForm.reset();
            setTimeout(() => {
              //save token in local storage 
              localStorage.setItem('token', res.token);
              //decode data form token 
              this._authService.saveUserDate();
              this._router.navigate(['/home']);
            }, 1000);
          }
          // this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.success = false;
          this.errorMessage = err.error?.message;
          this._cdr.detectChanges();
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.productsSubscribtion?.unsubscribe();
  }
}
