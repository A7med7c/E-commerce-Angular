import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  //registerForm : is the form group that represent object need to be sent to backend
  registerForm: FormGroup = new FormGroup({
    // each form control represent property in the json 
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
    rePassword: new FormControl(null),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
  }, this.confirmPassword)


  //custom validator 
  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('rePassword')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { mismatch: true };
  }


  register(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm)
    }
  }
}
