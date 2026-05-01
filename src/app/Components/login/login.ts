import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
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
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _toast = inject(ToastrService);
  private readonly _translate = inject(TranslateService);
  private readonly _translationService = inject(TranslationService);

  showPassword = false;
  isLoading = false;
  success = false;

  currentLang: string = 'en';

  ngOnInit(): void {
    this.currentLang = this._translationService.getCurrentLang();

    this._translationService.getCurrentLang$().subscribe(() => {
      this.currentLang = this._translationService.getCurrentLang();
    });
  }

  private loginSub?: Subscription;

  loginForm: FormGroup = this._fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]]
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.success = false;

    this.loginSub = this._authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.message === 'success') {
          this.success = true;
          this.loginForm.reset();

          //  translation instead of hardcoded text
          const message = this._translate.instant('login.toast.loginSuccess');
          this._toast.success(message);

          setTimeout(() => {
            localStorage.setItem('token', res.token);
            this._authService.saveUserData();
            this._router.navigate(['/home']);
          }, 200);
        }
      },

      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.success = false;

        console.error(err);

        // optional: translated error
        const errorMsg = this._translate.instant('login.toast.loginError');
        this._toast.error(errorMsg);

        this._cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}