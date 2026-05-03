import { NgClass, NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Core/Services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink, TranslatePipe],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnDestroy {

  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastrService);
  private readonly _translate = inject(TranslateService);
  private readonly _translationService = inject(TranslationService);

  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly success = signal(false);

  private loginSub?: Subscription;

  loginForm: FormGroup = this._fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]]
  });

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.success.set(false);

    this.loginSub = this._authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);

        if (res.message === 'success') {
          this.success.set(true);
          this.loginForm.reset();

          // Store token immediately (don't wait)
          localStorage.setItem('token', res.token);
          this._authService.saveUserData();

          //  translation instead of hardcoded text
          const message = this._translate.instant('login.toast.loginSuccess');
          this._toast.success(message);

          // Brief delay for UX (optional, can be removed)
          setTimeout(() => {
            this._router.navigate(['/home']);
          }, 100);
        }
      },

      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.success.set(false);

        console.error(err);

        // optional: translated error
        const errorMsg = this._translate.instant('login.toast.loginError');
        this._toast.error(errorMsg);
      }
    });
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}