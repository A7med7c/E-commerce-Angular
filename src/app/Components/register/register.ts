import { Component, inject, OnDestroy, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Core/Services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnDestroy {

  private readonly _authService = inject(AuthService)
  private readonly _formBuilder = inject(FormBuilder)
  private readonly _router = inject(Router)
  private readonly _toast = inject(ToastrService)


  readonly isLoading = signal(false);
  readonly success = signal(false);
  readonly showPassword = signal(false);
  productsSubscribtion!: Subscription



  // form builder syntax -> recommended
  registerForm: FormGroup = this._formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
    rePassword: [null],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  }, { validators: this.confirmPassword })

  // //registerForm : is the form group that represent object need to be sent to backend
  // registerForm: FormGroup = new FormGroup({
  //   // each form control represent property in the json 
  //   name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  //   email: new FormControl(null, [Validators.required, Validators.email]),
  //   password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
  //   rePassword: new FormControl(null),
  //   phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
  // }, this.confirmPassword)


  //custom validator 

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('rePassword')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { mismatch: true };
  }

  togglePassword() {
    this.showPassword.update((value) => !value);
  }
  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this._toast.warning('Please complete the required fields');
      return;
    }

    this.isLoading.set(true);
    this.success.set(false);

    this.productsSubscribtion = this._authService.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);

        this._toast.success('Account Created Successfully');

        if (res.message === 'success') {
          this.success.set(true);
          this.registerForm.reset();

          setTimeout(() => {
            this._router.navigate(['/login']);
          }, 300);
        }
      },

      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.success.set(false);

        this._toast.error(err.error?.message || 'Something went wrong');
      }
    });
  }
  // called in exit the component so we make unsubscribe here 
  ngOnDestroy(): void {
    this.productsSubscribtion?.unsubscribe();
  }
}
